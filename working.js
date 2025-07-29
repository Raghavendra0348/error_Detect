
let currentUser = localStorage.getItem("username");
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("username");

  // ✅ Show toast after login/signup
  if (localStorage.getItem("showLoginToast") === "true") {
    showLoginToast();
    localStorage.removeItem("showLoginToast");
  }

  // ✅ Update UI
  const signupBtn = document.getElementById("signupBtn");
  const profileBox = document.getElementById("userProfile");
  const userEmail = document.getElementById("userEmail");

  if (currentUser) {
    signupBtn.style.display = "none";
    profileBox.style.display = "inline-block";
    userEmail.textContent = currentUser;
  } else {
    signupBtn.style.display = "inline-block";
    profileBox.style.display = "none";
  }
});


function isLoggedIn() {
  return localStorage.getItem("username") !== null;
}


function showSignup() {
        localStorage.setItem("redirectAfterLogin", "index.html");
        window.location.href = "login.html";
}


function show(id) {
  // Hide all sections
  document.querySelectorAll('main > section').forEach(section => {
    section.classList.remove('active');
  });

  // Show the one requested
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
  }
}


function encodeHamming() {
        let data = document.getElementById("dataBits").value.trim();
        let parity = document.getElementById("paritySelect").value;
        if (!/^[01]+$/.test(data)) {
                return alert("🚫 Please enter a valid binary number (0s and 1s only).");
        }

        let m = data.length, r = 0;
        while (Math.pow(2, r) < m + r + 1) r++;
        let total = m + r;
        let h = Array(total + 1).fill(null);
        let j = 0;
        let steps = [];

        steps.push(`
    <div class="step-card">
      <div class="step-header">🔢 Step 1: Data Bits Count</div>
      <div class="step-body">You entered <strong>${m}</strong> data bits.</div>
    </div>
  `);

        steps.push(`
    <div class="step-card">
      <div class="step-header">📐 Step 2: Calculate Parity Bits</div>
      <div class="step-body">We calculate <strong>${r}</strong> parity bits because <code>2^r ≥ m + r + 1</code></div>
    </div>
  `);

        steps.push(`
    <div class="step-card">
      <div class="step-header">📦 Step 3: Total Bits in Hamming Code</div>
      <div class="step-body">Total bits = Data bits + Parity bits = <strong>${total}</strong></div>
    </div>
  `);

        for (let i = 1; i <= total; i++) {
                h[i] = (Math.log2(i) % 1 === 0) ? '🅿️' : data[j++];
        }

        steps.push(`
    <div class="step-card">
      <div class="step-header">🧩 Step 4: Insert Parity & Data Bits</div>
      <div class="step-body">
        We place parity bits at positions that are powers of 2 (marked as 🅿️):<br>
        <code class="bit-display">${h.slice(1).join(' ')}</code>
      </div>
    </div>
  `);

        for (let i = 0; i < r; i++) {
                let p = Math.pow(2, i), count = 0, pos = [];
                for (let k = 1; k <= total; k++) {
                        if ((k & p) !== 0) {
                                pos.push(k);
                                if (h[k] === '1') count++;
                        }
                }

                h[p] = (parity === 'odd')
                        ? (count % 2 === 0 ? '1' : '0')
                        : (count % 2 === 0 ? '0' : '1');

                steps.push(`
      <div class="step-card">
        <div class="step-header">🧮 Step 5: Calculate Parity Bit P${p}</div>
        <div class="step-body">
          <strong>P${p}</strong> checks positions: <code>${pos.join(', ')}</code><br>
          Number of 1s in those positions: <strong>${count}</strong><br>
          Parity Type: <strong>${parity.toUpperCase()}</strong><br>
          ➤ <strong>P${p} = ${h[p]}</strong>
        </div>
      </div>
    `);
        }

        document.getElementById("hammingResult").textContent = `✅ Hamming Code: ${h.slice(1).join('')}`;
        document.getElementById("hammingExplain").innerHTML = steps.join('');
        document.getElementById("hammingExplain").style.display = "none";
}

function toggleExplain(id) {
        if (!isLoggedIn()) {
                localStorage.setItem("redirectAfterLogin", "index.html");
                showSignup();
                return;
        }

        const el = document.getElementById(id);
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
}



function detectError() {
        const input = document.getElementById("errorInput").value.trim();
        const parity = document.getElementById("errorParity").value;
        if (!/^[01]+$/.test(input)) return alert("Invalid binary input");

        let rev = input.split("").reverse();
        let n = rev.length;
        let pos = 0;
        let steps = [];

        steps.push(`
    <div class="step-card">
      <div class="step-title">📥 Step 1</div>
      <div><strong>Input Code</strong>: <code class="bit-display">${input}</code></div>
    </div>`);

        for (let i = 0; Math.pow(2, i) <= n; i++) {
                let p = 1 << i;
                let count = 0;
                for (let k = 1; k <= n; k++) {
                        if ((k & p) && rev[k - 1] === '1') count++;
                }

                let bit = (parity === 'even') ? (count % 2 ? 1 : 0) : (count % 2 ? 0 : 1);
                pos += bit * p;

                steps.push(`
      <div class="step-card">
        <div class="step-title">🔍 Check P${p}</div>
        <div>
          <strong>Bits checked</strong>: ${[...Array(n).keys()].map(k => ((k + 1) & p) ? (k + 1) : null).filter(Boolean).join(', ')} <br>
          <strong>1s counted</strong>: ${count} <br>
          <strong>Expected Parity</strong>: ${bit}
        </div>
      </div>`);
        }

        let output = `Error Position: ${pos}\n`;
        if (pos > 0 && pos <= input.length) {
                let corrected = input.split('');
                corrected[input.length - pos] = corrected[input.length - pos] === '0' ? '1' : '0';
                output += `Corrected Code: ${corrected.join('')}`;

                steps.push(`
      <div class="step-card">
        <div class="step-title">🛠️ Correction</div>
        <div>
          <strong>Error at position</strong>: ${pos} <br>
          <strong>Corrected Code</strong>: <code class="bit-display">${corrected.join('')}</code>
        </div>
      </div>`);
        } else {
                output += `No Error Detected.`;

                steps.push(`
      <div class="step-card">
        <div class="step-title">✅ No Error</div>
        <div>
          The code has no detectable errors.
        </div>
      </div>`);
        }

        document.getElementById("errorResult").textContent = output;
        document.getElementById("errorExplain").innerHTML = steps.join('');
        document.getElementById("errorExplain").style.display = "none";
}
function convertNumber() {
        const base = parseInt(document.getElementById("inputBase").value);
        const input = document.getElementById("numberInput").value.trim().toUpperCase();

        let decimal = parseInt(input, base);
        if (isNaN(decimal)) return alert("🚫 Invalid number");

        const binary = decimal.toString(2);
        const octal = decimal.toString(8);
        const hex = decimal.toString(16).toUpperCase();

        document.getElementById("conversionResult").innerHTML = `
    Binary: ${binary}<br>
    Octal: ${octal}<br>
    Decimal: ${decimal}<br>
    Hex: ${hex}
  `;

        // 👉 Step-by-step Explanation
        let steps = [];

        steps.push(`
    <div class="step-card">
      <div class="step-title">📥 Step 1 - Input</div>
      <div><strong>You entered:</strong> <code class="bit-display">${input}</code> in base ${base}</div>
    </div>`);

        // Convert input to Decimal step-by-step (especially for base 16, 8, 2)
        if (base !== 10) {
                let baseDigits = input.split('').reverse();
                let sumParts = [];
                let total = 0;

                for (let i = 0; i < baseDigits.length; i++) {
                        let char = baseDigits[i];
                        let val = parseInt(char, base);
                        let power = Math.pow(base, i);
                        sumParts.push(`${val} × ${base}<sup>${i}</sup>`);
                        total += val * power;
                }

                steps.push(`
      <div class="step-card">
        <div class="step-title">🔄 Step 2 - To Decimal</div>
        <div>
          ${sumParts.join(" + ")} = <strong>${total}</strong>
        </div>
      </div>
    `);
        }

        // Decimal to Binary
        let binarySteps = [], d = decimal;
        while (d > 0) {
                binarySteps.push(`${d} ÷ 2 = ${Math.floor(d / 2)} remainder ${d % 2}`);
                d = Math.floor(d / 2);
        }
        steps.push(`
    <div class="step-card">
      <div class="step-title">💡 Step 3 - To Binary</div>
      <div>
        ${binarySteps.join('<br>')}<br>
        <strong>Binary (reversed remainders): ${binary}</strong>
      </div>
    </div>`);

        // Decimal to Octal
        let octalSteps = [], o = decimal;
        while (o > 0) {
                octalSteps.push(`${o} ÷ 8 = ${Math.floor(o / 8)} remainder ${o % 8}`);
                o = Math.floor(o / 8);
        }
        steps.push(`
    <div class="step-card">
      <div class="step-title">🔢 Step 4 - To Octal</div>
      <div>
        ${octalSteps.join('<br>')}<br>
        <strong>Octal: ${octal}</strong>
      </div>
    </div>`);

        // Decimal to Hex
        let hexSteps = [], h = decimal;
        const hexMap = "0123456789ABCDEF";
        while (h > 0) {
                let rem = h % 16;
                hexSteps.push(`${h} ÷ 16 = ${Math.floor(h / 16)} remainder ${rem} (${hexMap[rem]})`);
                h = Math.floor(h / 16);
        }
        steps.push(`
    <div class="step-card">
      <div class="step-title">🧮 Step 5 - To Hexadecimal</div>
      <div>
        ${hexSteps.join('<br>')}<br>
        <strong>Hex: ${hex}</strong>
      </div>
    </div>`);

        document.getElementById("conversionExplain").innerHTML = steps.join('');
        document.getElementById("conversionExplain").style.display = "none";
}


function convertGray() {
        let input = document.getElementById("grayBinaryInput").value.trim();
        let mode = document.getElementById("grayMode").value;
        if (!/^[01]+$/.test(input)) return alert("Invalid binary/gray");

        let steps = [], result = "";

        if (mode === "b2g") {
                let res = input[0];
                steps.push(`
      <div class="step-card">
        <div class="step-title">🎯 Binary → Gray</div>
        <div><strong>First bit</strong>: ${res} (unchanged)</div>
      </div>`);

                for (let i = 1; i < input.length; i++) {
                        let xor = (input[i - 1] === input[i]) ? "0" : "1";
                        res += xor;
                        steps.push(`
        <div class="step-card">
          <div class="step-title">Bit ${i + 1}</div>
          <div>${input[i - 1]} ⊕ ${input[i]} = <span class="step-value">${xor}</span></div>
        </div>`);
                }
                result = "Gray Code: " + res;
        } else {
                let res = input[0];
                let curr = input[0];
                steps.push(`
      <div class="step-card">
        <div class="step-title">🎯 Gray → Binary</div>
        <div><strong>First bit</strong>: ${res} (unchanged)</div>
      </div>`);

                for (let i = 1; i < input.length; i++) {
                        curr = (curr === input[i]) ? '0' : '1';
                        res += curr;
                        steps.push(`
        <div class="step-card">
          <div class="step-title">Bit ${i + 1}</div>
          <div>Previous binary: ${res[i - 1]}, Gray bit: ${input[i]} → <span class="step-value">${curr}</span></div>
        </div>`);
                }
                result = "Binary Code: " + res;
        }

        document.getElementById("grayResult").textContent = result;
        document.getElementById("grayExplain").innerHTML = steps.join('');
        document.getElementById("grayExplain").style.display = "none";
}


function logout() {
  document.getElementById("logoutModal").style.display = "block";
}

function confirmLogout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function closeModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function toggleMenu() {
        const menu = document.getElementById("menuLinks");
        menu.classList.toggle("show");
}
function toggleOverlay() {
        document.getElementById("mobileMenuOverlay").classList.toggle("show");
}

function closeMenu(event) {
        // Click outside the menu closes it
        document.getElementById("mobileMenuOverlay").classList.remove("show");
}
function toggleDropdown() {
        const menu = document.getElementById("dropdownMenu");
        menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}
function showLoginToast() {
  const toast = document.getElementById("loginToast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000); // 2 seconds
}

