const { Apriori } = require('node-apriori');
const data = require('./data/orders.json');
const aprioriData = require("./data/apriori.json")

class Order {
  constructor(rawData) {
    this.id = rawData.id;
    this.items = this.getAggregatedItems(rawData.line_items);
  }
  getAggregatedItems(items) {
    const aggregation = {};
    items
      .map((item) => new Item(item))
      .forEach((item) => {
        aggregation[item.name] = item.quantity;
      });
    return aggregation;
  }
}

class Item {
  constructor(line_item) {
    this.id = line_item.uid;
    this.quantity = parseInt(line_item.quantity);
    this.name = line_item.name;
  }
}

const getAggregations = () => {
  return orders.reduce(
    (obj, order) => {
      Object.entries(order.items).forEach(([key, quantity]) => {
        obj.items[key] = (obj.items[key] || 0) + 1;
        obj.total++;
      });

      return obj;
    },
    { items: {}, total: 0 }
  );
};

const createDataFrame = (transactions, items) => {
  const df = [];

  const cols = Object.entries(items).map(([key, quantity]) => key);
  console.log(cols);

  transactions.forEach((tr) => {
    const row = [];

    cols.forEach((col) => {
      const quantity = tr.items[col] ? 1 : 0; // if you want to make it quantity based change 1 with tr.items[col]
      row.push(quantity);
    });

    df.push(row);
  });
  return {
    df,
    cols,
  };
};

// Sanitize Data
const orders = data.map((d) => new Order(d));
console.log(JSON.stringify(orders, null, 2));

const aggregations = getAggregations();
console.log(aggregations);

const { df, cols } = createDataFrame(orders, aggregations.items);
console.table(df);

const calculateSupport = (aggregatedData) => {
  const { items, total } = aggregatedData;
  const supports = {};
  Object.entries(items).forEach(([key, value]) => {
    supports[key] = parseFloat(value / total);
  });
  return supports;
};

const supports = calculateSupport(aggregations);
console.log(supports);

createSubsets = (a, min) => {
  const fn = (n, src, got, all) => {
    if (n == 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }
    for (var j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
    return;
  };
  const all = [];
  for (let i = min; i < a.length; i++) {
    fn(i, a, [], all);
  }
  all.push(a);
  return all
};

/* const subsets = createSubsets(cols, 8);
console.log(subsets); */

console.log(aprioriData)
let transactions = [
  [1, 3, 4],
  [2, 3, 5],
  [1, 2, 3, 5],
  [2, 5],
  [1, 2, 3, 5],
];

// Execute Apriori with a minimum support of 40%. Algorithm is generic.
let apriori = new Apriori(0.4);

// Execute Apriori on a given set of transactions.
apriori.exec(aprioriData).then((result) => {
  // Returns both the collection of frequent itemsets and execution time in millisecond.
  let frequentItemsets = result.itemsets;
  let executionTime = result.executionTime;

  console.log(frequentItemsets,  { len: frequentItemsets.length,executionTime });
});
