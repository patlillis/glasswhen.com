const player = document.getElementById('player');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const songTitle = document.getElementById('song-title');
const progressBar = document.getElementById('song-progress-bar');

const mobileWindowWidth = 800;
let previousWindowWidth;

// Handle clicking on "Play" button.
playButton.addEventListener('click', startPlayback);

// Handle clicking on "Pause" button.
pauseButton.addEventListener('click', pausePlayback);

// Handle pressing the spacebar to toggle playback.
document.addEventListener('keypress', e => {
  if (e.key !== ' ') return;

  if (player.paused) {
    startPlayback();
  } else {
    pausePlayback();
  }
});

// Resizing to a small window hides the player controls, so go ahead and stop
// playback. Otherwise there's music playing with no way for the user to stop
// it, which can be annoying.
window.addEventListener('resize', () => {
  const newInnerWidth = window.innerWidth;
  if (
    newInnerWidth <= mobileWindowWidth &&
    previousWindowWidth > mobileWindowWidth
  ) {
    pausePlayback();
  }

  previousWindowWidth = newInnerWidth;
});

function startPlayback() {
  playButton.classList.add('hidden');
  pauseButton.classList.remove('hidden');
  songTitle.classList.remove('hidden');

  player.play();
}

function pausePlayback() {
  pauseButton.classList.add('hidden');
  playButton.classList.remove('hidden');

  player.pause();
}

// Handle audio finish.
player.addEventListener('ended', () => {
  // Re-set the UI back to not-playing mode, and hide the song list.
  pausePlayback();
  songTitle.classList.add('hidden');

  // Reset the progress bar, doing a quick fun little animation where it drops
  // down out of view below the bottom of the screen.
  progressBar.classList.add('reset');
  progressBar.style.transform = 'translateY(100%)';
  setTimeout(() => {
    progressBar.classList.remove('reset');
    progressBar.style.transform = 'translate(-100%)';
  }, 100);
});

// Animation handler for player progress bar.
// CSS animation would probably be more performant. However, we need to be able
// to pause/resume the animation, as well as coordinate with the audio player's
// progress, so JavaScript animation is a better option. Hopefully using
// "requestAnimationFrame" should mitigate the performance aspects.
function animate() {
  requestAnimationFrame(animate);
  if (!player.paused) {
    // Animate the progress bar from "translate(-100%)" to "translate(0%)".
    // This is better than animating "width" property or "left", because
    // changing "transform" doesn't trigger a re-layout.
    const progress = player.currentTime / player.duration;
    const translate = (1 - progress) * 100;
    progressBar.style.transform = `translate(-${translate}%)`;
  }
}
requestAnimationFrame(animate);
