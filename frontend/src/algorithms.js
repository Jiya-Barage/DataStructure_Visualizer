// Clean (uninstrumented) algorithms, used for honest timing measurements.

export const plainSorters = {
  "Bubble Sort": (a) => {
    for (let i = 0; i < a.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < a.length - 1 - i; j++) {
        if (a[j] > a[j + 1]) { const t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; swapped = true; }
      }
      if (!swapped) break;
    }
    return a;
  },
  "Selection Sort": (a) => {
    for (let i = 0; i < a.length - 1; i++) {
      let m = i;
      for (let j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
      if (m !== i) { const t = a[i]; a[i] = a[m]; a[m] = t; }
    }
    return a;
  },
  "Insertion Sort": (a) => {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
      a[j + 1] = key;
    }
    return a;
  },
  "Merge Sort": (a) => {
    const tmp = new Array(a.length);
    const sort = (lo, hi) => {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1;
      sort(lo, mid); sort(mid + 1, hi);
      let i = lo, j = mid + 1, k = lo;
      while (i <= mid && j <= hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
      while (i <= mid) tmp[k++] = a[i++];
      while (j <= hi) tmp[k++] = a[j++];
      for (let t = lo; t <= hi; t++) a[t] = tmp[t];
    };
    sort(0, a.length - 1);
    return a;
  },
  "Quick Sort": (a) => {
    const sort = (lo, hi) => {
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (a[mid] < a[lo]) { const t = a[mid]; a[mid] = a[lo]; a[lo] = t; }
        if (a[hi] < a[lo]) { const t = a[hi]; a[hi] = a[lo]; a[lo] = t; }
        if (a[hi] < a[mid]) { const t = a[hi]; a[hi] = a[mid]; a[mid] = t; }
        let t = a[mid]; a[mid] = a[hi]; a[hi] = t;
        const pivot = a[hi];
        let i = lo;
        for (let j = lo; j < hi; j++) {
          if (a[j] < pivot) { t = a[i]; a[i] = a[j]; a[j] = t; i++; }
        }
        t = a[i]; a[i] = a[hi]; a[hi] = t;
        if (i - lo < hi - i) { sort(lo, i - 1); lo = i + 1; } else { sort(i + 1, hi); hi = i - 1; }
      }
    };
    sort(0, a.length - 1);
    return a;
  },
  "Heap Sort": (a) => {
    const n = a.length;
    const sift = (i, size) => {
      for (;;) {
        let big = i;
        const l = 2 * i + 1, r = l + 1;
        if (l < size && a[l] > a[big]) big = l;
        if (r < size && a[r] > a[big]) big = r;
        if (big === i) return;
        const t = a[i]; a[i] = a[big]; a[big] = t; i = big;
      }
    };
    for (let i = (n >> 1) - 1; i >= 0; i--) sift(i, n);
    for (let end = n - 1; end > 0; end--) { const t = a[0]; a[0] = a[end]; a[end] = t; sift(0, end); }
    return a;
  },
};

export function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;
  return -1;
}

export function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}

/* ---------- Graph algorithms (adjacency list: array of [{to, w}]) ---------- */

export function bfsSteps(adj, start) {
  const seen = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const { to } of adj[u]) if (!seen.has(to)) { seen.add(to); queue.push(to); }
  }
  return order;
}

export function dfsSteps(adj, start) {
  const seen = new Set();
  const order = [];
  const visit = (u) => {
    seen.add(u); order.push(u);
    for (const { to } of adj[u]) if (!seen.has(to)) visit(to);
  };
  visit(start);
  return order;
}

export function dijkstra(adj, source) {
  const n = adj.length;
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  const done = Array(n).fill(false);
  const order = [];
  dist[source] = 0;
  for (let step = 0; step < n; step++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (u === -1 || dist[u] === Infinity) break;
    done[u] = true;
    order.push(u);
    for (const { to, w } of adj[u]) {
      if (dist[u] + w < dist[to]) { dist[to] = dist[u] + w; prev[to] = u; }
    }
  }
  return { dist, prev, order };
}
