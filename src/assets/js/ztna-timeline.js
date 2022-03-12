let timelineItemIndex = 1;
showTimelineItems(timelineItemIndex);

function plusTimelineItem(n) {
  showTimelineItems((timelineItemIndex += n));
  console.log("click");
  n > 0
    ? (document.getElementById("timeline").scrollLeft += 74)
    : (document.getElementById("timeline").scrollLeft -= 74);
}

function currentTimelineItem(n) {
  showTimelineItems((timelineItemIndex = n));
}

function showTimelineItems(n) {
  let i;
  const timelineItems = document.getElementsByClassName("timeline-item");
  const timelineYears = document.getElementsByClassName("timelineYear");

  if (n > timelineItems.length) {
    timelineItemIndex = 1;
  }
  if (n < 1) {
    timelineItemIndex = timelineItems.length;
  }
  for (i = 0; i < timelineItems.length; i++) {
    timelineItems[i].style.display = "none";
  }
  for (i = 0; i < timelineYears.length; i++) {
    timelineYears[i].className = timelineYears[i].className.replace(
      " active",
      ""
    );
  }
  timelineItems[timelineItemIndex - 1].style.display = "block";
  timelineYears[timelineItemIndex - 1].className += " active";
}
