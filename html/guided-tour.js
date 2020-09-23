const tour1 = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }}
);

tour1.addStep({
  id: 'page-load-step',
  text: 'Welcome to Digital Peace Talks!',
  buttons: [
    {
      text: 'Next',
      action: tour1.next
    }
  ]
});

tour1.addStep({
  id: 'navigation-step',
  text: 'Navigate around and explore the space',
  attachTo: {
    element: '.nav-help',
    on: 'left'
  },
  buttons: [
    {
      text: 'Next',
      action: tour1.next
    }
  ]
});

tour1.addStep({
  id: 'topic-step',
  text: 'You can click on any of the topics that interests you',
  attachTo: {
    element: '.babylonElementWrapper',
	on: 'top'
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour1.next
    }
  ]
});


const tour2 = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }}
);
chosenTopic = "";
tour2.addStep({
  id: 'opinion-topic-step',
  text: "You chose topic"+ chosenTopic + ", good choice",
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour2.next
    }
  ]
});

tour2.addStep({
  id: 'opinion-opinions-step',
  text: 'These are opinions other users expressed',
  attachTo: {
    element: '.babylonElementWrapper.opinionWrapper',
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour2.next
    }
  ]
});

tour2.addStep({
  id: 'opinion-dialogs-step',
  text: 'The lines represent dialogs between opinions',
  attachTo: {
    element: '.babylonElementWrapper.dialogWrapper',
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour2.next
    }
  ]
});

tour2.addStep({
  id: 'opinion-add-step',
  text: 'Click here to add your own opinion',
  attachTo: {
    element: '#new-opinion-btn',
    on: 'top'
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour2.next
    }
  ]
});


const tour3 = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }}
);

tour3.addStep({
  id: 'opinion-added-step',
  text: 'Nice! You\'ve added your first opinion',
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour3.next
    }
  ]
});

tour3.addStep({
  id: 'opinion-request-dialog-step',
  text: 'Now click another opinion to request a dialog',
  attachTo: {
    element: '.babylonElementWrapper.opinionWrapper',
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour3.next
    }
  ]
});

const tour4 = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }}
);

tour4.addStep({
  id: 'opinion-dialog-requested-step',
  text: 'You\'ve requested a dialog',
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour4.next
    }
  ]
});

tour4.addStep({
  id: 'opinion-dialog-requested-2-step',
  text: 'You will be notified once the other user accepted your request',
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour4.next
    }
  ]
});

tour4.addStep({
  id: 'opinion-dialog-requested-4-step',
  text: 'Try posting in several topics and request many dialogs to get moving',
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour4.next
    }
  ]
});


const tour5 = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }}
);

tour5.addStep({
  id: 'opinion-dialog-started-step',
  text: 'Your request was accepted! Click the list to start chatting',
  attachTo: {
    element: '.btn-bar-icon',
    on: 'top'
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour5.next
    }
  ]
});

const tour6 = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }}
);

tour6.addStep({
  id: 'opinion-dialog-started-step',
  text: 'Use this slider to rate how well the dialogue is going, A positive rating will bring your opinions closer together, A negative one will drive them apart!',
  attachTo: {
    element: '.babylonElementWrapper',
  },
  classes: 'example-step-extra-class',
  buttons: [
    {
      text: 'Next',
      action: tour6.next
    }
  ]
});
