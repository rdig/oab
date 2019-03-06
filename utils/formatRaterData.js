module.exports = values => {
  /*
   * @NOTE Tally up the scores
   */
  const raterStats = {};
  values.map((entry, index) => {
    const rater = entry[0];
    const positiveRating = parseInt(entry[3], 10) > 0;
    if (index !== 0) {
      if (raterStats[rater]) {
        raterStats[rater].ratings += 1;
      } else {
        raterStats[rater] = {
          ratings: 1,
          positiveCount: 0,
          negativeCount: 0,
        };
      }
      if (positiveRating) {
        raterStats[rater].positiveCount += 1;
      } else {
        raterStats[rater].negativeCount += 1;
      }
    }
  });
  /*
   * Create the top raters array (of arrays) to be displayed
   *
   * The format for the invididual arrays are:
   * [
   *   Rater (name + username),
   *   Rating Count (number, always positive, bigger than 0)
   *   Positive Rating Count (number, may be 0)
   *   Negative Rating Count (number, may be 0)
   *   Place (number, always positive, bigger than 0)
   * ]
   */
  return Object
    .keys(raterStats)
    .map(rater => {
      const { ratings, positiveCount, negativeCount } = raterStats[rater];
      return [
        rater,
        ratings,
        positiveCount,
        negativeCount
      ];
    })
    .sort((firstArray, secondArray) => secondArray[1] - firstArray[1])
    .map((entry, index, ratings) => {
      let place = ratings[index - 1] ? ratings[index - 1][4] + 1 : index + 1;
      if (ratings[index - 1] && ratings[index - 1][1] === entry[1]) {
        place = ratings[index - 1][4];
      }
      entry.push(place);
      return entry;
    });
};
