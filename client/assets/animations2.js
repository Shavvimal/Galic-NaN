let tl = gsap.timeline({delay: 1});
tl.from('#header', {duration: 0.5, ease: "power2. out", y:-150});
tl.from('#table1', {duration: 0.5, ease: "power2. out", opacity:0, y:-10});
tl.from('#table2', {duration: 0.5, ease: "power2. out", opacity:0, y:-10});
tl.from('#table3', {duration: 0.5, ease: "power2. out", opacity:0, y:-10});

