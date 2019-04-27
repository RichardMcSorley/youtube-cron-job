const youtube = require("../api/youtube");
const wod = require("../api/wod");
const functions = {
  youtube,
  wod
};
const {LIB_NAME, FUNC_NAME, FUNC_PARAM} = process.env;

function main(){
  console.log(LIB_NAME, FUNC_NAME, FUNC_PARAM)
 functions[LIB_NAME][FUNC_NAME](FUNC_PARAM)
  .then((r)=>console.log(r))
  .catch((e)=>console.log(e))
  .finally(()=>process.exit(0));
}
main();