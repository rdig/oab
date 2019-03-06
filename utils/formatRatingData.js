module.exports = values => {
  /*
   * @NOTE Tally up the scores
   */
  const ratingStats = {};
  values.map((entry, index) => {
    const rating = parseInt(entry[3], 10);
    const user = entry[1];
    const positiveRating = rating > 0;
    if (index !== 0) {
      if (ratingStats[user]) {
        ratingStats[user].score += rating;
      } else {
        ratingStats[user] = {
          score: rating,
          positiveCount: 0,
          negativeCount: 0,
        };
      }
      if (positiveRating) {
        ratingStats[user].positiveCount += 1;
      } else {
        ratingStats[user].negativeCount += 1;
      }
    }
  });
  /*
   * Create the ratings array (of arrays) to be displayed
   *
   * The format for the invididual arrays are:
   * [
   *   Ratee (name + username),
   *   Rating (number, may be negative)
   *   Positive Rating Count (number, may be 0)
   *   Negative Rating Count (number, may be 0)
   *   Place (number, always positive, bigger than 0)
   * ]
   */
  return Object
    .keys(ratingStats)
    .map(user => {
      const { score, positiveCount, negativeCount } = ratingStats[user];
      return [
        user,
        score,
        positiveCount,
        negativeCount
      ];
    })
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
      let place = ratings[index - 1] ? ratings[index - 1][4] + 1 : index + 1;
      if (ratings[index - 1] && ratings[index - 1][1] === entry[1]) {
        place = ratings[index - 1][4];
      }
      entry.push(place);
      return entry;
    });
};
