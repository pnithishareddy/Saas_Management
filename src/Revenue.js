
import { fd, h, money, num, planMrr } from './data';
import { Bars, COLORS, Delta, Donut, Line, Table, sum } from './components';

/* Page: Revenue */
export function RevenueV({ cus, plans, cur, prev }) {
  const act = cus.filter(
    c => c.status === 'active' || c.status === 'past_due'
  );

  const byPlan = plans.map((p, i) => ({
    l: p.name,
    v: act.filter(c => c.planId === p.id).length * planMrr(p),
    c: COLORS[i % COLORS.length]
  }));

  const currentRevenue = sum(cur, 'rev');
  const previousRevenue = sum(prev, 'rev');

  const M = [
    ['Revenue', currentRevenue, previousRevenue, money],
    [
      'Avg daily revenue',
      currentRevenue / Math.max(1, cur.length),
      previousRevenue / Math.max(1, prev.length),
      money
    ],
    ['API calls', sum(cur, 'api'), sum(prev, 'api'), num],
    [
      'Best day',
      Math.max(0, ...cur.map(d => d.rev)),
      Math.max(0, ...prev.map(d => d.rev)),
      money
    ]
  ].map((m, i) => ({
    id: i,
    metric: m[0],
    cur: m[1],
    prev: m[2],
    f: m[3]
  }));

  return h`
    <div class="grid">
      <div class="card">
        <h3>Revenue trend</h3>
        <${Line}
          series=${[
            {
              name: 'Current',
              data: cur.map(d => d.rev),
              color: '#0f766e'
            },
            {
              name: 'Previous',
              data: prev.map(d => d.rev),
              color: '#d9822b',
              dash: '4 3'
            }
          ]}
          labels=${cur.map(d => fd(d.t))}
          fmt=${money}
          height=${230}
        />
      </div>

      <div class="grid g2">
        <div class="card">
          <h3>MRR by plan</h3>
          <${Bars} items=${byPlan} />
        </div>

        <div class="card">
          <h3>Revenue mix</h3>
          <${Donut} items=${byPlan.map(b => ({ ...b, v: b.v || 0 }))} />
        </div>
      </div>

      <div class="card">
        <h3>Period comparison</h3>
        <${Table}
          size=${10}
          rows=${M}
          cols=${[
            {
              k: 'metric',
              label: 'Metric'
            },
            {
              k: 'cur',
              label: 'Current',
              render: r => r.f(r.cur)
            },
            {
              k: 'prev',
              label: 'Previous',
              render: r => r.f(r.prev)
            },
            {
              k: 'd',
              label: 'Change',
              val: r => r.prev
                ? (r.cur - r.prev) / r.prev
                : 0,
              render: r => h`
                <${Delta} a=${r.cur} b=${r.prev} />
              `
            }
          ]}
        />
      </div>
    </div>
  `;
}
