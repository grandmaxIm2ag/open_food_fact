#! /usr/bin/env python3

import csv
from re import match
from read_categories import products_categories

def continent_of(country, data):
    for row2 in data:
        if(row2[1].lower() == country.lower()):
            return row2[0]
    print("error %s not in the database" % country)
    return

switcher = {
    "the ue":"usa",
    "the united states":"usa",
    "the usa":"usa",
    "the eu":"usa",
    "united states":"usa",
    "swiss":"switzerland",
    "gb":"england",
    "britain":"england"
}

data=[]
with open("continent-countries.csv") as country_file:
    tmp_data = csv.reader(country_file, delimiter=',')
    for row in tmp_data:
        data.append(row)
data = data[1:]

grade = {}
with open ("tsv/products.tsv") as grade_file:
    reader = csv.reader(grade_file, delimiter = '\t')
    for row in reader:
        if(row[4] != ""):
            grade[row[0]]=row[4]

with open("tsv/products_labels.tsv") as label_file:
    product_country = []
    reader = csv.reader(label_file, delimiter = '\t')
    count = 0
    for row in reader:
        if match(r"made-in(.)*",row[1]):
            country=' '.join((row[1].split("-"))[2:])
            country = switcher.get(country,country)
            if row[0] in products_categories and row[0] in grade:
                product_country.append([row[0],country,
                                        continent_of(country,data),
                                        products_categories[row[0]],
                                        grade[row[0]]])

with open('tsv/hypotesis.tsv', 'w', newline='') as csvfile:
    wr = csv.writer(csvfile, delimiter='\t',
                    quotechar='|', quoting=csv.QUOTE_MINIMAL)
    wr.writerow(["Product","Country","Continent","Categorie","grade"])
    for p in product_country:
        wr.writerow(p)
