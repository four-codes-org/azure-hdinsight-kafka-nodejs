function topicLookupFromList(topicList, search) {
  return topicList.find((topic) => topic == search);
}

module.exports = topicLookupFromList;
