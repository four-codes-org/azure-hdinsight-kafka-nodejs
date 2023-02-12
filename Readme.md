# azure-hdinsight-kafka-nodejs

convert the list variable into a list

```js
var a = "['xxx', 'yyy', 'zzz']";
a = a.replace(/'/g, '"');
a = JSON.parse(a);
console.log(typeof a);
a.forEach((a) => console.log(a));
```


![image](https://user-images.githubusercontent.com/57703276/218307671-07a6587b-ad7c-409f-ab96-c931d6bcf643.png)
