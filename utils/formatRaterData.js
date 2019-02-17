module.exports = values => {
  /*
   * @NOTE Tally up the scores
   */
  const ratingStats = {};
  values.map((entry, index) => {
    if (index !== 0) {
      ratingStats[entry[0]] =
        ratingStats[entry[0]] ? ratingStats[entry[0]] + 1 : 1;
    }
  });
  /*
   * Create the top raters array (of arrays) to be displayed
   *
   * The format for the invididual arrays are:
   * [
   *   Rater (name + username),
   *   Rating Count (number, always positive, bigger than 0)
   *   Place (number, always positive, bigger than 0)
   * ]
   */
  return Object
    .keys(ratingStats)
    .map(key => [key, ratingStats[key]])
    .sort((firstArray, secondArray) => secondArray[1] - firstArray[1])
    .map((entry, index, ratings) => {
      let place = ratings[index - 1] ? ratings[index - 1][2] + 1 : index + 1;
      if (ratings[index - 1] && ratings[index - 1][1] === entry[1]) {
        place = ratings[index - 1][2];
      }
      entry.push(place);
      return entry;
    });
};
