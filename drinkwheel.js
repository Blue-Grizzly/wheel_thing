const names = [
    'Sandra',
    'Emil',
    'Jonas',
    'Julia',
    'Amanda',
    'Olivia',
    'Emilie',
    'Adam',
  ];

const colors = [
    'red',
    'blue',
    'green',
    'yellow',
];
  
  const events = {
    listeners: {},
    addListener: function (eventName, fn) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(fn);
    },
    fire: function (eventName, ...args) {
      if (this.listeners[eventName]) {
        for (let fn of this.listeners[eventName]) {
          fn(...args);
        }
      }
    },
  };
  
  const rand = (m, M) => Math.random() * (M - m) + m;
  const tot = names.length;
  const spinEl = document.querySelector("#spin");
  const wheelSeg = document.querySelector("#wheel").getContext("2d");
  const dia = wheelSeg.canvas.width;
  const rad = dia / 2;
  const pi = Math.PI;
  const tau = 2 * pi; // tau = 2π (almost)
  const arc = tau / names.length;
  
  const friction = 0.991; // 1 = no friction, 0 = no motion. 0.991 seems nice
  let angVel = 0; // Angular velocity
  let ang = 0; // Angle in radians
  
  let spinButtonClicked = false;
  
  const getIndex = () => Math.floor(tot - (ang / tau) * tot) % tot;
  
  function draw_segment(name, i) {
    console.log(name, i);
    const ang = arc * i;
    wheelSeg.save();
  
    // segment background
    wheelSeg.beginPath();
    wheelSeg.fillStyle = colors[i % colors.length];
    wheelSeg.moveTo(rad, rad);
    wheelSeg.arc(rad, rad, rad, ang, ang + arc);
    wheelSeg.lineTo(rad, rad);
    wheelSeg.fill();
    
    // segment text
    wheelSeg.translate(rad, rad);
    wheelSeg.rotate(ang + arc / 2);
    wheelSeg.textAlign = "right";
    wheelSeg.fillStyle = "black";
    wheelSeg.font = "bold 30px 'Arial', sans-serif";
    wheelSeg.fillText(name, rad - 10, 10);
  
    wheelSeg.restore();
  }
  
  function rotate() {
    const name = names[getIndex()];
    wheelSeg.canvas.style.transform = `rotate(${ang - pi / 2}rad)`;
  
    spinEl.textContent = !angVel ? "SPIN" : name;
    spinEl.style.background = 'black';
    spinEl.style.color = 'white';
  }
  
  function frame() {
    // Fire an event after the wheel has stopped spinning
    if (!angVel && spinButtonClicked) {
      const finalSector = names[getIndex()];
      events.fire("spinEnd", finalSector);
      spinButtonClicked = false; // reset the flag
      return;
    }
  
    angVel *= friction; // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0; // Bring to stop
    ang += angVel; // Update angle
    ang %= tau; // Normalize angle
    rotate();
  }
  
  function spinner() {
    frame();
    requestAnimationFrame(spinner);
  }
  
  function init() {
    names.forEach(draw_segment);
    rotate(); // Initial rotation
    spinner(); // init spinner
    spinEl.addEventListener("click", () => {
      if (!angVel) angVel = rand(0.25, 0.45);
      spinButtonClicked = true;
    });
  }
  
  init();
  
  events.addListener("spinEnd", (name) => {
    document.querySelector("#ding").play();
    document.querySelector("#result").textContent = name;
  });

//   function randomRGB() {
//     return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
//   }



// TODO: Add timer so it spins on its own every 5 min or so


// REQUEST: Add a button to add a new name to the wheel
// REQUEST: Add a button to remove a name from the wheel
// REQUEST: Add some kind of animation when the wheel stops spinning
// REQUEST: Add sfx
// REQUEST: Add christmas theme
// REQUEST: Add christmas song when wheel stops spinning