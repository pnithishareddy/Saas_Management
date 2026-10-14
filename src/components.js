
import { useState, useMemo, useEffect } from 'react';
import { h, money, num } from './data';

/* Reusable UI components: Modal, Confirm, Form, Table, Charts */

/* ---------- Modal ---------- */
export function Modal({ title, onClose, children, drawer }) {
  useEffect(() => {
    const k = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', k);

    return () => {
      window.removeEventListener('keydown', k);
    };
  }, [onClose]);

  return h`
    <div
      class=${'ov' + (drawer ? ' drw' : '')}
      onMouseDown=${e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        class=${drawer ? 'dr' : 'md'}
        role="dialog"
        aria-modal="true"
        aria-label=${title}
      >
        <div
          class="row"
          style=${{
            justifyContent: 'space-between',
            marginBottom: 12
          }}
        >
          <h2 style=${{ margin: 0, fontSize: 18 }}>
            ${title}
          </h2>

          <button
            type="button"
            class="btn s"
            onClick=${onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        ${children}
      </div>
    </div>
  `;
}

/* ---------- Confirmation dialog ---------- */
export function Confirm({
  title,
  text,
  onYes,
  onNo,
  label = 'Delete'
}) {
  return h`
    <${Modal} title=${title} onClose=${onNo}>
      <p style=${{ color: 'var(--mut)' }}>
        ${text}
      </p>

      <div
        class="row"
        style=${{ justifyContent: 'flex-end' }}
      >
        <button
          type="button"
          class="btn"
          onClick=${onNo}
        >
          Cancel
        </button>

        <button
          type="button"
          class="btn d"
          onClick=${onYes}
        >
          ${label}
        </button>
      </div>
    <//>
  `;
}

/* ---------- Form ---------- */
export function Form({
  fields,
  init,
  onSave,
  onCancel,
  submit = 'Save changes'
}) {
  const [v, setV] = useState(init);
  const [er, setEr] = useState({});
  const [busy, setBusy] = useState(false);

  const go = e => {
    e.preventDefault();

    const errors = {};

    fields.forEach(f => {
      const message = f.check && f.check(v[f.k], v);

      if (message) {
        errors[f.k] = message;
      }
    });

    setEr(errors);

    if (Object.keys(errors).length) {
      return;
    }

    setBusy(true);

    try {
      onSave(v);
    } catch (error) {
      setEr({
        _form: error.message || 'Unable to save changes.'
      });
      setBusy(false);
    }
  };

  return h`
    <form onSubmit=${go} noValidate>
      ${er._form && h`
        <div class="er" role="alert">
          ${er._form}
        </div>
      `}

      ${fields.map(f => h`
        <div class="f" key=${f.k}>
          <label for=${'f' + f.k}>
            ${f.label}
          </label>

          ${f.opts
            ? h`
                <select
                  id=${'f' + f.k}
                  value=${v[f.k] ?? ''}
                  aria-invalid=${!!er[f.k]}
                  onChange=${e =>
                    setV({
                      ...v,
                      [f.k]: e.target.value
                    })
                  }
                >
                  ${f.opts.map(o => h`
                    <option
                      key=${o[0]}
                      value=${o[0]}
                    >
                      ${o[1]}
                    </option>
                  `)}
                </select>
              `
            : h`
                <input
                  id=${'f' + f.k}
                  type=${f.type || 'text'}
                  value=${v[f.k] ?? ''}
                  aria-invalid=${!!er[f.k]}
                  onInput=${e =>
                    setV({
                      ...v,
                      [f.k]: e.target.value
                    })
                  }
                />
              `}

          ${er[f.k] && h`
            <span class="er" role="alert">
              ${er[f.k]}
            </span>
          `}
        </div>
      `)}

      <div
        class="row"
        style=${{ justifyContent: 'flex-end' }}
      >
        <button
          type="button"
          class="btn"
          onClick=${onCancel}
          disabled=${busy}
        >
          Cancel
        </button>

        <button
          type="submit"
          class="btn p"
          disabled=${busy}
        >
          ${busy ? 'Saving…' : submit}
        </button>
      </div>
    </form>
  `;
}

/* ---------- Table with sorting and pagination ---------- */
export function Table({
  cols,
  rows,
  onRow,
  size = 8,
  empty = 'Nothing matches these filters.'
}) {
  const [sk, setSk] = useState({
    k: cols[0]?.k || '',
    d: 1
  });

  const [pg, setPg] = useState(0);

  useEffect(() => {
    setPg(0);
  }, [rows.length]);

  const sorted = useMemo(() => {
    const c = cols.find(c => c.k === sk.k) || cols[0];

    if (!c) {
      return [...rows];
    }

    const getValue = r => c.val ? c.val(r) : r[c.k];

    return [...rows].sort((a, b) => {
      const x = getValue(a);
      const y = getValue(b);

      if (x == null && y == null) return 0;
      if (x == null) return -1 * sk.d;
      if (y == null) return 1 * sk.d;

      if (typeof x === 'number' && typeof y === 'number') {
        return (x - y) * sk.d;
      }

      return String(x).localeCompare(String(y)) * sk.d;
    });
  }, [cols, rows, sk]);

  const pages = Math.max(1, Math.ceil(rows.length / size));
  const p = Math.min(pg, pages - 1);
  const part = sorted.slice(p * size, p * size + size);

  if (!rows.length) {
    return h`
      <div class="empty">
        <div style=${{ fontSize: 30 }}>∅</div>
        <p>${empty}</p>
      </div>
    `;
  }

  return h`
    <div>
      <div class="tw">
        <table>
          <thead>
            <tr>
              ${cols.map(c => h`
                <th
                  key=${c.k}
                  scope="col"
                  aria-sort=${
                    sk.k !== c.k
                      ? 'none'
                      : sk.d > 0
                        ? 'ascending'
                        : 'descending'
                  }
                  onClick=${() =>
                    setSk({
                      k: c.k,
                      d: sk.k === c.k ? -sk.d : 1
                    })
                  }
                >
                  ${c.label}
                  ${sk.k === c.k
                    ? sk.d > 0 ? ' ▲' : ' ▼'
                    : ''}
                </th>
              `)}
            </tr>
          </thead>

          <tbody>
            ${part.map(r => h`
              <tr
                class="r"
                key=${r.id}
                onClick=${() => onRow && onRow(r)}
                style=${{
                  cursor: onRow ? 'pointer' : 'default'
                }}
              >
                ${cols.map(c => h`
                  <td key=${c.k}>
                    ${c.render ? c.render(r) : r[c.k]}
                  </td>
                `)}
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <div class="pg">
        <span>
          ${p * size + 1}–${Math.min(rows.length, p * size + size)}
          of ${rows.length}
        </span>

        <div class="row">
          <button
            type="button"
            class="btn s"
            disabled=${p === 0}
            onClick=${() => setPg(p - 1)}
          >
            Prev
          </button>

          <span>Page ${p + 1}/${pages}</span>

          <button
            type="button"
            class="btn s"
            disabled=${p >= pages - 1}
            onClick=${() => setPg(p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Status badge ---------- */
export const Badge = ({ s }) => h`
  <span class=${'badge s-' + s}>
    ${String(s || 'unknown').replace('_', ' ')}
  </span>
`;

/* ---------- Search and filters ---------- */
export function Bar({ q, setQ, filters = [], children }) {
  return h`
    <div class="row" style=${{ marginBottom: 12 }}>
      <input
        type="search"
        placeholder="Search…"
        aria-label="Search"
        value=${q}
        onInput=${e => setQ(e.target.value)}
        style=${{ flex: '1 1 180px' }}
      />

      ${filters.map(f => h`
        <select
          key=${f.label}
          aria-label=${f.label}
          value=${f.v}
          onChange=${e => f.set(e.target.value)}
        >
          <option value="all">
            ${f.label}: all
          </option>

          ${f.opts.map(o => h`
            <option key=${o[0]} value=${o[0]}>
              ${o[1]}
            </option>
          `)}
        </select>
      `)}

      ${children}
    </div>
  `;
}

/* ---------- Comparison indicator ---------- */
export const Delta = ({ a, b }) => {
  const d = b ? ((a - b) / Math.abs(b)) * 100 : 0;

  return h`
    <span class=${'dl ' + (d >= 0 ? 'up' : 'dn')}>
      ${d >= 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(1)}%
    </span>
  `;
};

/* ---------- KPI card ---------- */
export function Kpi({ label, val, a, b }) {
  return h`
    <div class="card kpi">
      <span>${label}</span>
      <b>${val}</b>

      ${b !== undefined && h`
        <div>
          <${Delta} a=${a} b=${b} />
          <span>vs previous</span>
        </div>
      `}
    </div>
  `;
}

/* ---------- Line chart ---------- */
export function Line({ series, labels, fmt = num, height = 190 }) {
  const [hv, setHv] = useState(null);
  const W = 600;
  const H = height;
  const P = 26;
  const n = series[0]?.data.length || 0;
  const mx = Math.max(
    1,
    ...series.flatMap(s => s.data)
  ) * 1.08;

  const X = i => P + i * (W - P - 6) / Math.max(1, n - 1);
  const Y = v => H - 18 - v / mx * (H - 30);

  const path = d => d
    .map((v, i) =>
      (i ? 'L' : 'M') +
      X(i).toFixed(1) +
      ' ' +
      Y(v).toFixed(1)
    )
    .join('');

  if (!n) {
    return h`
      <div class="empty">
        No chart data available.
      </div>
    `;
  }

  return h`
    <div>
      <div style=${{
        minHeight: 18,
        fontSize: 12,
        color: 'var(--mut)'
      }}>
        ${hv !== null
          ? labels[hv] + ' — ' +
            series.map(s =>
              s.name + ': ' + fmt(s.data[hv] || 0)
            ).join(' · ')
          : 'Hover the chart for values'}
      </div>

      <svg
        viewBox=${'0 0 ' + W + ' ' + H}
        width="100%"
        role="img"
        aria-label="Revenue trend chart"
        onMouseLeave=${() => setHv(null)}
        onMouseMove=${e => {
          const r = e.currentTarget.getBoundingClientRect();
          const position = ((e.clientX - r.left) / r.width * W - P)
            / (W - P - 6) * (n - 1);

          setHv(
            Math.max(0, Math.min(n - 1, Math.round(position)))
          );
        }}
      >
        ${[0, 0.5, 1].map(f => h`
          <g key=${f}>
            <line
              x1=${P}
              x2=${W}
              y1=${Y(mx * f / 1.08)}
              y2=${Y(mx * f / 1.08)}
              stroke="var(--line)"
            />
            <text x="0" y=${Y(mx * f / 1.08) + 3}>
              ${Intl.NumberFormat('en-IN', {
                notation: 'compact'
              }).format(mx * f / 1.08)}
            </text>
          </g>
        `)}

        <path
          d=${path(series[0].data) +
            'L' + X(n - 1) + ' ' + (H - 18) +
            'L' + X(0) + ' ' + (H - 18) + 'Z'}
          fill=${cv(series[0].color)}
          opacity=".12"
        />

        ${series.map(s => h`
          <path
            key=${s.name}
            d=${path(s.data)}
            fill="none"
            stroke=${cv(s.color)}
            strokeWidth="2"
            strokeDasharray=${s.dash || ''}
          />
        `)}

        ${hv !== null && h`
          <line
            x1=${X(hv)}
            x2=${X(hv)}
            y1="4"
            y2=${H - 18}
            stroke="var(--mut)"
            strokeDasharray="3"
          />
        `}

        <text x=${P} y=${H - 4}>
          ${labels[0]}
        </text>

        <text x=${W - 6} y=${H - 4} textAnchor="end">
          ${labels[n - 1]}
        </text>
      </svg>

      <div class="row" style=${{ fontSize: 12 }}>
        ${series.map(s => h`
          <span key=${s.name}>
            <i style=${{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 3,
              background: cv(s.color),
              marginRight: 5
            }} />
            ${s.name}
          </span>
        `)}
      </div>
    </div>
  `;
}

/* ---------- Horizontal bar chart ---------- */
export function Bars({ items, fmt = money }) {
  const mx = Math.max(1, ...items.map(i => i.v));

  if (!items.length) {
    return h`<div class="empty">No data available.</div>`;
  }

  return h`
    <div>
      ${items.map(i => h`
        <div key=${i.l} style=${{ marginBottom: 10 }}>
          <div
            class="row"
            style=${{ justifyContent: 'space-between' }}
          >
            <span>${i.l}</span>
            <b>${fmt(i.v)}</b>
          </div>

          <div class="bar">
            <i style=${{
              width: Math.max(0, i.v / mx * 100) + '%',
              background: i.c
            }} />
          </div>
        </div>
      `)}
    </div>
  `;
}

/* ---------- Donut chart ---------- */
export function Donut({ items }) {
  const tot = items.reduce((a, b) => a + b.v, 0) || 1;
  let acc = 0;
  const R = 40;
  const C = 2 * Math.PI * R;

  if (!items.length) {
    return h`<div class="empty">No data available.</div>`;
  }

  return h`
    <div class="row" style=${{ gap: 18 }}>
      <svg
        viewBox="0 0 100 100"
        width="140"
        height="140"
        role="img"
        aria-label="Revenue mix chart"
        style=${{ transform: 'rotate(-90deg)' }}
      >
        ${items.map(i => {
          const f = i.v / tot;

          const el = h`
            <circle
              key=${i.l}
              cx="50"
              cy="50"
              r=${R}
              fill="none"
              stroke=${i.c}
              strokeWidth="16"
              strokeDasharray=${f * C + ' ' + C}
              strokeDashoffset=${-acc * C}
            />
          `;

          acc += f;
          return el;
        })}
      </svg>

      <div>
        ${items.map(i => h`
          <div key=${i.l} style=${{ fontSize: 13 }}>
            <i style=${{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 3,
              background: i.c,
              marginRight: 6
            }} />
            ${i.l}
            <b>${(i.v / tot * 100).toFixed(0)}%</b>
          </div>
        `)}
      </div>
    </div>
  `;
}

/* ---------- Shared colors and helpers ---------- */
export const COLORS = [
  'var(--acc)',
  'var(--acc2)',
  '#0ea5e9',
  '#be185d',
  '#64748b'
];

const cv = c => ({
  '#0f766e': 'var(--acc)',
  '#d9822b': 'var(--acc2)'
}[c] || c);

export const sum = (a, k) =>
  a.reduce((total, item) => total + (Number(item[k]) || 0), 0);
