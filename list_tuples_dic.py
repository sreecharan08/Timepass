
# """
# -------------------------------------------Lists--------------------------------------------------------------------------------
# """

# # Creating and accessing the list

# a = ["apple","Mango","pineapple","cherrry"]
# print(a[2:6])
# print(a[3])


# # Modifying the list
# a[2] = "Orange"
# print(a)

# b = ["Apple","bananna","Cherry","Dragon fruit","Grapes","Kiwi","Mango","Orange",]
# print("Value of b is:",b)
# b[4:7] = ["Samsung","Apple","Blueberry","Rasberry pie"]
# print(b)
# #adding items
# b.insert(2,"watermelon")
# print(b)

# b.append("IQOO")
# print(b)

# print(a)
# print(b)
# a.extend(b)
# print("The total no.of lists:",a)

# #Removing items from list
# b.remove("Samsung")
# print(b)
# #pop
# b.pop(1)
# print(b)

# b.pop()
# print(b)
# #delete
# del b[1]
# print(b)
# #deletes the whole list
# del b

# c= ["AMG","BMW","Chiron","Dodge","Ford"]
# print(c)
# c.clear()
# print(c)


# #Experiment on len and range
# myitems = ["Akash","sreehari","Shreya","Pranay","Nithin","Praddeep","Rohith","Roshan","Ash","Gouri"]
# count=0
# for i in range(len(myitems)):
#     print(myitems)
#     count+=1

# print(count)

# length = len(myitems)
# print(length)

# num = [120,36,54,256,666,99,856544]
# num.sort()
# print(num)

# for i in a:
#     num.append(i)

# print(num)


# #Excercise
# colors = ["red","green","blue"]
# print(colors[0])
# colors[1]="yellow"
# colors.append("purple")
# print(colors)
# colors.remove("red")
# print(colors)


"""
---------------------------------------------------Tuples----------------------------------------------------------------------
"""
# a = ("apple","cherry","bananna","Dragon fruit")
# print(a)

# y = list(a)
# y[1]="Carrot"
# print(y)
# a = tuple(y)

# print(a)


# x = list(a)
# x.append("Potato")
# a=tuple(x)
# print(a)

# #Unpacking
# cars = ("Chiron","Jesko","911rs","challanger","p1","sian","huayra","zonda")
# (black,*Orange,red)=cars
# print(black)
# print(Orange)
# print(red)
# print()
# for i in range(len(cars)):
#     print(cars[i])

# newCars = cars*3
# print(newCars)


"""
-----------------------------------------------SETS------------------------------------------------------------------------------
"""
# set1 = {"apple","cherry","watermelon"}
# print(set1)

# set3=(("Apple","Bananna","cherry","watermelon"))

# print(set3)
# print(len(set1))


# for i in set3:
#     print(i)

# print("apple" in set1)
# print("Bananna" not in set3)

# set1.add("Orange")
# print(set1)

# set1.update(set3)
# print("updated set is", set1)


# #removing 

# set1.remove("apple")
# print(set1)

# set1.discard("cherry")
# print(set1)

# set3 = {"Hello","hi","how are you","good morning","Nice meeting","pleasure meeting u"}
# print(set3)
# x = set3.pop()

# print(x)
# print(set3)

# set3.clear()
# print(set3)

# del set3

# set1 = frozenset({"apple","bananna","cherry","kl"})
# print(set1)


"""
---------------------------------------------------Dictionary---------------------------------------------------------------------
"""

# dict = {
#     "brand":"Bugatti",
#     "model":"Chiron",
#     "year": 2025,
#     "colors": ['red','yellow',"green","purple","pink"]
# }
# dict1 = {"name":"jimmy", "age":19, "hobby":"coding"}

# print(dict["brand"])
# print(len(dict))

# p = dict.keys()
# print(p)
# dict["color"] = "yellow"
# print(p)

# v = dict.values()
# print(v)
# dict["type"] = "hypercar"
# print(v)

# i = dict.items()
# print(i)

# dict["model"] = "Veryon"
# print(i)
