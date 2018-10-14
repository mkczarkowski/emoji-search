function doAsyncCall() {
  return new Promise((res, rej) => {
      res('success')
  });
}

export default doAsyncCall;
