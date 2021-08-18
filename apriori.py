!pip install apyori

import numpy as np
import pandas as pd
from apyori import apriori

store_data = pd.read_csv('apriori.csv', header=None)

df_shape = store_data.shape
records = []
for i in range(0, df_shape[0]):
  records.append([str(store_data.values[i,j]) for j in range(0, df_shape[1]) ])

association_rules = apriori(records, min_support=0.50, min_confidence=0.7,  min_length=2)
association_results = list(association_rules)

print(len(association_results))

print(association_results)
