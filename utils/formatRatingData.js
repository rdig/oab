module.exports = values => {
  /*
   * @NOTE Tally up the scores
   */
  const ratingStats = {};
  values.map((entry, index) => {
    if (index !== 0) {
      ratingStats[entry[1]] = ratingStats[entry[1]]
        ? ratingStats[entry[1]] + parseInt(entry[3], 10)
        : parseInt(entry[3], 10);
    }
  });
  /*
   * Create the ratings array to be displayed
   */
  return Object
    .keys(ratingStats)
    .map(key => [key, ratingStats[key]])
    /*
     * @NOTE Can't use the short hand here since we're dealing with
     * negative integers
     */
    .sort((firstArray, secondArray) => {
      if (firstArray[1] > secondArray[1]) {
        return 0;
      }
      return 1;
    })
    .map((entry, index, ratings) => {
      let place = ratings[index - 1] ? ratings[index - 1][2] + 1 : index + 1;
      if (ratings[index - 1] && ratings[index - 1][1] === entry[1]) {
        place = ratings[index - 1][2];
      }
      entry.push(place);
      return entry;
    });
};
