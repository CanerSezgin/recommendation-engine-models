import numpy as np
import pandas as pd

# Import Data
df = pd.read_csv('Online Retail.csv')
df.head()


# Clean Data
df_baskets = df[['InvoiceNo', 'StockCode', 'Description', 'Quantity']]
df_baskets.head()

# Examine the most popular products
df.groupby('Description').agg(
    orders=('InvoiceNo', 'nunique'),
    quantity=('Quantity', 'sum')
).sort_values(by='orders', ascending=False).head(10)

df_items = df_baskets.pivot_table(index='InvoiceNo', columns=['Description'], values='Quantity').fillna(0)
df_items.head(3)


def get_recommendations(df, item):
    recommendations = df.corrwith(df[item])
    recommendations.dropna(inplace=True)
    recommendations = pd.DataFrame(recommendations, columns=['correlation']).reset_index()
    recommendations = recommendations.sort_values(by='correlation', ascending=False)
    
    return recommendations

recommendations = get_recommendations(df_items, 'WHITE HANGING HEART T-LIGHT HOLDER')
recommendations.head()