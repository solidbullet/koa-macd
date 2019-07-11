function request(p) {
    console.log(p);
    return Promise.resolve();
  }
  
  async function task(rounds) {
    console.log("new round is", rounds);
    await request(1);
    await request(2);
    await request(3);
  }
  
  let rounds = 0;
  
  async function run() {
    await task(rounds);
    rounds++;
    setTimeout(() => {
      run();
    }, 1000);
  }
  
  run();