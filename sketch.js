/**
 * 電流急急棒 - 固定波浪挑戰版
 * 特點：第三關為「固定不移動」的波浪路徑，並配有定點移動陷阱
 */

let gameState = "INTRO"; 
let currentLevel = 1;
const totalLevels = 3;

let angle = 0;          
let pathPulse = 0;      
let obstaclePos = 0;    
let direction = 1;

const V_WIDTH = 1000;   
const V_HEIGHT = 600;
let currentScale = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  pixelDensity(1); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(40, 30, 60); // 深紫色背景

  let scaleW = windowWidth / V_WIDTH;
  let scaleH = windowHeight / V_HEIGHT;
  currentScale = min(scaleW, scaleH) * 0.95;
  let translateX = (windowWidth - V_WIDTH * currentScale) / 2;
  let translateY = (windowHeight - V_HEIGHT * currentScale) / 2;

  push();
  translate(translateX, translateY);
  scale(currentScale);

  if (gameState === "INTRO") {
    displayIntroScreen();
  } else if (gameState === "START") {
    drawLevelPath();
    drawPlayer();
    displayLevelHint();
  } else if (gameState === "PLAY") {
    updateMechanics(); 
    drawLevelPath();
    checkCollision(); 
    drawPlayer();
  } else {
    displayEndScreen();
  }

  pop();
}

function updateMechanics() {
  angle += 0.05; 
  pathPulse = sin(frameCount * 0.1) * 8; 
  // 陷阱移動邏輯
  obstaclePos += (5 + currentLevel) * direction;
  if (obstaclePos > 120 || obstaclePos < -120) direction *= -1;
}

function drawLevelPath() {
  noStroke();
  
  // --- 共通起點 (淺粉紫色) ---
  fill(180, 150, 255);
  rect(30, 250, 80, 100, 15); 

  // --- 安全路徑顏色 (米白色) ---
  fill(255, 250, 230); 
  
  if (currentLevel === 1) {
    // 第一關：Z 字型
    rect(110, 275, 250, 50); 
    rect(310, 100, 50, 225); 
    rect(310, 100, 550, 50); 
    fill(100, 200, 255); 
    rect(860, 100, 60, 60, 10);
  } 
  else if (currentLevel === 2) {
    // 第二關：旋轉風車
    rect(110, 275, 150, 50); 
    ellipse(300, 300, 180, 180); 
    rect(300, 275, 400, 50);  
    ellipse(700, 300, 180, 180); 
    rect(700, 275, 150, 50);  
    
    push(); translate(300, 300); rotate(angle); fill(255, 100, 120);
    rect(-10, -85, 20, 170, 8); rotate(HALF_PI); rect(-10, -85, 20, 170, 8); pop();
    push(); translate(700, 300); rotate(-angle * 1.3); fill(255, 100, 120);
    rect(-10, -85, 20, 170, 8); rotate(HALF_PI); rect(-10, -85, 20, 170, 8); pop();

    fill(100, 200, 255);
    rect(850, 275, 60, 60, 10);
  } 
  else if (currentLevel === 3) {
    // --- 第三關：【固定波浪路 + 定點陷阱】 ---
    rect(110, 275, 50, 50); // 起點橋樑
    
    const waveFreq = 0.015; 
    const waveAmp = 120;    
    const startX = 160;
    const endX = 930;
    const pathBaseY = 300;
    const pW = 55; // 路徑寬度

    // 繪製固定的波浪路徑 (不隨時間移動)
    for (let x = startX; x < endX; x += 4) {
      let y = pathBaseY + sin((x - startX) * waveFreq) * waveAmp;
      fill(255, 250, 230);
      ellipse(x, y, pW, pW);
    }
    
    // 繪製三個定點上下移動的陷阱 (草莓紅)
    fill(255, 100, 120);
    const trapPoints = [350, 550, 750]; // 三個陷阱的 X 位置
    for (let tx of trapPoints) {
      let tyBase = pathBaseY + sin((tx - startX) * waveFreq) * waveAmp;
      // 陷阱會繞著波浪路徑中心上下浮動
      ellipse(tx, tyBase + obstaclePos, 22, 22);
    }

    // 終點 (固定在波浪末端)
    let finalY = pathBaseY + sin((endX - startX) * waveFreq) * waveAmp;
    fill(100, 200, 255); 
    rect(endX - 10, finalY - 30, 60, 60, 10);
  }
}

function drawPlayer() {
  let px = mouseX_V(); let py = mouseY_V();
  push();
  translate(px, py);
  fill(255, 220, 50); stroke(200, 150, 0); strokeWeight(2);
  ellipse(0, 0, 16, 16); 
  fill(50); noStroke();
  ellipse(-3, -2, 2, 2); ellipse(3, -2, 2, 2);
  noFill(); stroke(50); strokeWeight(1);
  arc(0, 2, 6, 4, 0, PI);
  pop();
}

function checkCollision() {
  let c = get(mouseX, mouseY);
  if (c[0] === 40 && c[1] === 30 && c[2] === 60) gameState = "GAMEOVER";
  else if (c[0] === 255 && c[1] === 100 && c[2] === 120) gameState = "GAMEOVER";
  else if (c[0] === 100 && c[1] === 200 && c[2] === 255) {
    if (currentLevel < totalLevels) gameState = "WIN";
    else gameState = "ALL_CLEAR";
  }
}

function displayIntroScreen() {
  textAlign(CENTER, CENTER);
  fill(255, 200, 100); textSize(55);
  text("🍭 卡哇急急棒 ⚡", V_WIDTH/2, 200);
  fill(255); textSize(22);
  text("點擊紫色起點開始挑戰吧！總共有三關๐˙Ⱉ˙๐", V_WIDTH/2, 300);
  fill(150, 255, 150); textSize(28);
  text("✨ 點擊滑鼠開始挑戰 ✨", V_WIDTH/2, 450);
}

function displayLevelHint() {
  textAlign(CENTER);
  fill(255, 230, 150); textSize(35);
  text("⭐ Level " + currentLevel, V_WIDTH/2, 80);
}

function displayEndScreen() {
  textAlign(CENTER, CENTER);
  if (gameState === "GAMEOVER") {
    fill(255, 150, 150); textSize(60); text("哎呀！撞到了 😭", V_WIDTH/2, 300);
  } else if (gameState === "WIN") {
    fill(150, 255, 150); textSize(60); text("順利過關！💖", V_WIDTH/2, 300);
  } else if (gameState === "ALL_CLEAR") {
    fill(255, 215, 0); textSize(65); text("🏆 恭喜通關 你好棒！ 🏆", V_WIDTH/2, 300);
  }
  fill(255); textSize(24); text("點擊滑鼠繼續", V_WIDTH/2, 450);
}

function mouseX_V() {
  let tx = (windowWidth - V_WIDTH * currentScale) / 2;
  return (mouseX - tx) / currentScale;
}
function mouseY_V() {
  let ty = (windowHeight - V_HEIGHT * currentScale) / 2;
  return (mouseY - ty) / currentScale;
}

function mousePressed() {
  if (gameState === "INTRO") gameState = "START";
  else if (gameState === "START") {
    let mvx = mouseX_V(); let mvy = mouseY_V();
    if (mvx > 30 && mvx < 110 && mvy > 250 && mvy < 350) gameState = "PLAY";
  } 
  else if (gameState === "WIN") { currentLevel++; gameState = "START"; }
  else if (gameState === "GAMEOVER") { gameState = "START"; }
  else if (gameState === "ALL_CLEAR") { currentLevel = 1; gameState = "INTRO"; }
}
