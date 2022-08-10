# azure-hdinsight-kafka-nodejs

convert the list variable into a list

```js
var a = "['xxx', 'yyy', 'zzz']";
a = a.replace(/'/g, '"');
a = JSON.parse(a);
console.log(typeof a);
a.forEach((a) => console.log(a));
```


