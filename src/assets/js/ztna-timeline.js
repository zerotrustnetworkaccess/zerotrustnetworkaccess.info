let timelineItemIndex = 1;
let currentItem;
const slides = document.querySelectorAll(".timeline-item");

console.log(slides.length);
let translateAmount = 100;
let translate = 0;

document.getElementById("prev").disabled = true;

function plusTimelineItem(index, direction) {
  showTimelineItems((timelineItemIndex += index));

  if (currentItem) {
    console.log(currentItem);
    translate = -100 * (currentItem - 1);
  }

  direction === "next"
    ? (translate -= translateAmount)
    : (translate += translateAmount);

  slides.forEach((slide) => {
    slide.style.transform = `translateX(${translate}%)`;
    currentItem = null;
  });

  if (translate === 0) {
    document.getElementById("prev").disabled = true;
  } else document.getElementById("prev").disabled = false;

  if (translate === (slides.length - 1) * -100) {
    document.getElementById("next").disabled = true;
  } else document.getElementById("next").disabled = false;

  index > 0
    ? (document.getElementById("timeline").scrollLeft += 74)
    : (document.getElementById("timeline").scrollLeft -= 74);
}

function currentTimelineItem(index) {
  showTimelineItems((timelineItemIndex = index));
  currentItem = index;
  const translateAmount = 100 * -(index - 1);

  console.log("currentItem years: " + currentItem);
  slides.forEach((slide) => {
    slide.style.transform = `translateX(${translateAmount}%)`;
  });

  if (currentItem === 1) {
    document.getElementById("prev").disabled = true;
  } else document.getElementById("prev").disabled = false;

  if (currentItem === slides.length) {
    document.getElementById("next").disabled = true;
  } else document.getElementById("next").disabled = false;
}

function showTimelineItems(n) {
  let i;
  const timelineYears = document.getElementsByClassName("timelineYear");
  for (i = 0; i < timelineYears.length; i++) {
    timelineYears[i].className = timelineYears[i].className.replace(
      " active",
      ""
    );
  }
  timelineYears[timelineItemIndex - 1].className += " active";
}

showTimelineItems(timelineItemIndex);

// slide = (direction) => {
//   direction === "next"
//     ? (translate -= translateAmount)
//     : (translate += translateAmount);
//   slides.forEach(
//     (slide) => (slide.style.transform = `translateX(${translate}%)`)
//   );
// };
