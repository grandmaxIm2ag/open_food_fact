#! /usr/bin/env python3

import csv

with open("tsv/categories_taxonomy.tsv") as tree_file:
    reader = csv.reader(tree_file, delimiter='\t')
    b = True
    _child = []
    _parent = []
    for row in reader:
        if b:
            b = False #Skip the first line
            continue
        if not (row[0] in _parent):
            _parent.append(row[0])
        if not (row[1] in _child):
            _child.append(row[1])

child = []
for cat in _child:
    if not(cat in _parent):
        child.append(cat)
        
parent = []            
for cat in _parent:
    if not(cat in _child):
        parent.append(cat)

choose_cat = parent
        
products_categories = {}
with open("tsv/products_categories_full.tsv") as product_file:
    reader = csv.reader(product_file, delimiter='\t')
    for row in reader:
        if( row[1] in choose_cat):
            products_categories[row[0]]=row[1]
