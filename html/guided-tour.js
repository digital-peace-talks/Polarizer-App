const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }
}
);

tour.addStep({
  text: 'Welcome to Digital Peace Talks!',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: 'Use these controls to navigate.',
  attachTo: {
    element: '.nav-help',
    on: 'left'
  },
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: "See these spacy floating items? That's topics up for discussion!",
  attachTo: {
    element: '.babylonElementWrapper',
    on: 'top'
  },
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: "Let's get right to it: Click the topic you are most interested in.",
  buttons: [
    {
      text: 'Next',
      action: tour.hide
    }
  ]
});

tour.addStep({
  text: "Well done!",
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: 'The items in this space are expressions of opinions from other users.',
  attachTo: {
    element: '.babylonElementWrapper.opinionWrapper',
  },
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: 'The lines between the opinions mean they are engaged in a dialogue. Green lines means the dialogue was perceived as positive!',
  attachTo: {
    element: '.babylonElementWrapper.dialogWrapper',
  },
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: 'Once you are ready to join in, click here to publish your opinion.',
  attachTo: {
    element: '#new-opinion-btn',
    on: 'top'
  },
  buttons: [
    {
      text: 'Next',
      action: tour.hide
    }
  ]
});

tour.addStep({
  text: 'Your opinion has been added!',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: 'To get attention for your opinion, you need to engage in positive rated dialogues! Simply click on an opinion you want to discuss with.',
  buttons: [
    {
      text: 'Next',
      action: tour.hide
    }
  ]
});

tour.addStep({
  text: "Dialogues need both sides' consent! Click here to request it.",
  attachTo: {
    element: '#btn-request-dialog',
    on: 'top'
  },
  buttons: [
    {
      text: 'Next',
      action: tour.hide
    }
  ]
});

tour.addStep({
  text: 'Request sent',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: 'You have reached the end of the tutorial. Once your first requests get accepted, it is up to you to engage in dialogues perceived as positive!',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep({
  text: 'This is where you will be notified when others users approve or request a dialogue with you. Good luck!',
  buttons: [
    {
      text: 'Finish',
      action: () => {
        whoami.user.preferences.guidedTour = false;
	    	dpt.userUpdate(whoami.dptUUID, { preferences: { "guidedTour": false}});
        tour.next();
      }
    }
  ]
});
