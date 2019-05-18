module.exports = values => {
  /*
   * @NOTE Tally up the scores
   */
  const raterStats = {};
  values.map((entry, index) => {
    const rater = entry[0];
    const positiveRating = parseInt(entry[5], 10) > 0;
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
    .sort(
      (firstArray, secondArray) =>
        (parseInt(secondArray[1], 10) - parseInt(firstArray[1], 10)),
      )
    .map((entry, index, ratings) => {
      const previousRaterEntry = ratings[index - 1];
      const previousPlace = previousRaterEntry ? previousRaterEntry[4] : 0;
      const previousCount = previousRaterEntry ? previousRaterEntry[1] : 0;
      const currentCount = entry[1];
      let place = previousRaterEntry ? previousPlace + 1 : index + 1;
      if (previousRaterEntry && previousCount === currentCount) {
        place = previousPlace;
      }
      entry.push(place);
      return entry;
    });
};
