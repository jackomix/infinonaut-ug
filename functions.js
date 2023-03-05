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

// rbArray - random biased number using inputs in an array
// Used for easily processing random biased number values set in the registry.
function rbArray(array) {
  return rb(array[0], array[1], array[2], array[3])
}

// Generates a random weird name, checking the name in the given history array to see if the name already exists (and thus should be regenerated).
function nameGen(syllables, history) {
    do {
        nameGenPairs = ["ab","ac","ad","af","ag","ah","aj","ak","al","am","an","ap","aq","ar","as","at","av","aw","ax","ay","az","ba","ca","da","fa","ga","ha","ja","ka","la","ma","na","pa","qa","ra","sa","ta","va","wa","xa","ya","za","eb","ec","ed","ef","eg","eh","ej","ek","el","em","en","ep","eq","er","es","et","ev","ew","ex","ey","ez","be","ce","de","fe","ge","he","je","ke","le","me","ne","pe","qe","re","se","te","ve","we","xe","ye","ze","ib","ic","id","if","ig","ih","ij","ik","il","im","in","ip","iq","ir","is","it","iv","iw","ix","iy","iz","bi","ci","di","fi","gi","hi","ji","ki","li","mi","ni","pi","qi","ri","si","ti","vi","wi","xi","yi","zi","ob","oc","od","of","og","oh","oj","ok","ol","om","on","op","oq","or","os","ot","ov","ow","ox","oy","oz","bo","co","do","fo","go","ho","jo","ko","lo","mo","no","po","qo","ro","so","to","vo","wo","xo","yo","zo","ub","uc","ud","uf","ug","uh","uj","uk","ul","um","un","up","uq","ur","us","ut","uv","uw","ux","uy","uz","bu","cu","du","fu","gu","hu","ju","ku","lu","mu","nu","pu","qu","ru","su","tu","vu","wu","xu","yu","zu"];
        nameGenResult = ""
        for (var i = 1; i < syllables; i++) {
            nameGenResult += nameGenPairs[rn(0, nameGenPairs.length)]
        }
    }
    while (history.includes(nameGenResult))
    history.push(nameGenResult)

    return nameGenResult
}

// Converts colors to a format Minecraft uses
function convertColorToMC(color) {
  return parseInt(color.substring(1), 16)
}

// Brightens or darkens colors
// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
const changeBrightness=(p,c0,c1,l)=>{
  let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
  if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
  if(!this.pSBCr)this.pSBCr=(d)=>{
      let n=d.length,x={};
      if(n>9){
          [r,g,b,a]=d=d.split(","),n=d.length;
          if(n<3||n>4)return null;
          x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
      }else{
          if(n==8||n==6||n<4)return null;
          if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
          d=i(d.slice(1),16);
          if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
          else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
      }return x};
  h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
  if(!f||!t)return null;
  if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
  else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
  a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
  if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
  else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}