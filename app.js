const PARTS = {
  display: { title: 'Pantalla LCD', use: 'Muestra el valor medido, la unidad, la polaridad y otros indicadores del instrumento.', safety: 'Verifica siempre la unidad y la funcion seleccionada antes de interpretar la lectura.' },
  dial: { title: 'Perilla selectora', use: 'Permite escoger la magnitud electrica y, segun el modelo, el rango de medicion.', safety: 'Selecciona la funcion correcta antes de conectar el multimetro al circuito.' },
  hold: { title: 'Boton HOLD', use: 'Congela temporalmente en la pantalla el valor observado para facilitar su registro.', safety: 'Una lectura retenida no significa que el circuito haya dejado de estar energizado.' },
  '10a': { title: 'Terminal 10 A', use: 'Entrada para medir corrientes altas dentro del limite y tiempo indicado por el fabricante.', safety: 'Una conexion incorrecta puede fundir el fusible o producir una condicion peligrosa.' },
  ma: { title: 'Terminal mA / microA', use: 'Entrada protegida para medir corrientes pequenas, normalmente en miliamperios o microamperios.', safety: 'No excedas el valor maximo indicado junto al terminal.' },
  com: { title: 'Terminal COM', use: 'Terminal comun o de referencia. Aqui se conecta normalmente la punta de prueba negra.', safety: 'Comprueba que la punta negra este firmemente conectada antes de medir.' },
  vohm: { title: 'Terminal V / ohm / Hz', use: 'Entrada habitual de la punta roja para voltaje, resistencia, continuidad, frecuencia y funciones compatibles.', safety: 'No intentes medir corriente con la punta roja en esta entrada si el procedimiento exige un terminal de amperaje.' }
};

AFRAME.registerComponent('look-at-camera', {
  tick: function () {
    const camera = document.querySelector('#camera');
    if (!camera) return;
    const target = new THREE.Vector3();
    camera.object3D.getWorldPosition(target);
    this.el.object3D.lookAt(target);
  }
});

AFRAME.registerComponent('hotspot', {
  init: function () {
    const el = this.el;
    const baseScale = new THREE.Vector3(1, 1, 1);
    el.addEventListener('mouseenter', () => {
      el.object3D.scale.set(1.35, 1.35, 1.35);
      el.setAttribute('material', 'color', '#FBBF24');
    });
    el.addEventListener('mouseleave', () => {
      el.object3D.scale.copy(baseScale);
      el.setAttribute('material', 'color', '#38BDF8');
    });
    el.addEventListener('click', () => showPart(el.dataset.key));
  }
});

function showPart(key) {
  const part = PARTS[key];
  if (!part) return;
  const panel = document.querySelector('#infoPanel');
  document.querySelector('#infoTitle').setAttribute('value', part.title);
  document.querySelector('#infoUse').setAttribute('value', part.use);
  document.querySelector('#infoSafety').setAttribute('value', 'Precaucion: ' + part.safety);
  panel.setAttribute('visible', true);
  panel.object3D.scale.set(0.1, 0.1, 0.1);
  panel.removeAttribute('animation__open');
  panel.setAttribute('animation__open', 'property: scale; to: 1 1 1; dur: 260; easing: easeOutBack');
}

window.addEventListener('DOMContentLoaded', () => {
  const welcome = document.querySelector('#welcome');
  const start = document.querySelector('#startButton');
  const help = document.querySelector('#helpButton');
  const scene = document.querySelector('#scene');
  const loading = document.querySelector('#loading');
  start.addEventListener('click', () => welcome.classList.add('hidden'));
  help.addEventListener('click', () => welcome.classList.remove('hidden'));
  scene.addEventListener('loaded', () => loading.classList.add('hidden'));
  document.querySelector('#customEnterVR').addEventListener('click', async () => {
    welcome.classList.add('hidden');
    if (!scene.hasLoaded) return;
    try { await scene.enterVR(); }
    catch (err) { showToast('El modo VR necesita un navegador compatible y una pagina publicada con HTTPS.'); }
  });
});

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}
