// rn - random number
// Generate a random number in a given range
// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function rn(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

// rb - random biased number
// Generates a random number in a given range, but is biased towards a certain number with a configurable amount.
// https://stackoverflow.com/questions/29325069/how-to-generate-random-numbers-biased-towards-one-value-in-a-range
function rb(min, max, bias, influence) {
  var rnd = Math.random() * (max - min) + min,
    mix = Math.random() * influence;
  return rnd * (1 - mix) + bias * mix;
}

// Generates a random weird name, checking the name in the given history array to see if the name already exists (and thus should be regenerated).
function nameGen(syllables, history) {
    do {
        nameGenPairs = ["ab","ac","ad","af","ag","ah","aj","ak","al","am","an","ap","aq","ar","as","at","av","aw","ax","ay","az","ba","ca","da","fa","ga","ha","ja","ka","la","ma","na","pa","qa","ra","sa","ta","va","wa","xa","ya","za","eb","ec","ed","ef","eg","eh","ej","ek","el","em","en","ep","eq","er","es","et","ev","ew","ex","ey","ez","be","ce","de","fe","ge","he","je","ke","le","me","ne","pe","qe","re","se","te","ve","we","xe","ye","ze","ib","ic","id","if","ig","ih","ij","ik","il","im","in","ip","iq","ir","is","it","iv","iw","ix","iy","iz","bi","ci","di","fi","gi","hi","ji","ki","li","mi","ni","pi","qi","ri","si","ti","vi","wi","xi","yi","zi","ob","oc","od","of","og","oh","oj","ok","ol","om","on","op","oq","or","os","ot","ov","ow","ox","oy","oz","bo","co","do","fo","go","ho","jo","ko","lo","mo","no","po","qo","ro","so","to","vo","wo","xo","yo","zo","ub","uc","ud","uf","ug","uh","uj","uk","ul","um","un","up","uq","ur","us","ut","uv","uw","ux","uy","uz","bu","cu","du","fu","gu","hu","ju","ku","lu","mu","nu","pu","qu","ru","su","tu","vu","wu","xu","yu","zu"];
        nameGenResult = ""
        for (var i = 0; i < syllables; i++) {
            nameGenResult += nameGenPairs[rn(0, nameGenPairs.length)]
        }
    }
    while (history.includes(nameGenResult))
    history.push(nameGenResult)

    return nameGenResult
}