function compareArr(arr1, arr2) {
  const sameTags = arr2.filter((obj2) =>
    arr1.find((obj1) => obj1.tag === obj2.tag)
  );
  // we need to add a new key of confidenceInt. This will be obj1.confidence / obj2.confidence
  const totalConfidence = sameTags.reduce((acc, curr) => {
    return acc + curr.confidence;
  }, 0);
  console.log();
  return [sameTags, totalConfidence];
}

compareArr();

// api/v1/imaggas/getAll()
// returns big array of all memes w/ their API array of objects
// BUT THEN
// we map over that array of memes, then call the compareArr() on each meme and map through
