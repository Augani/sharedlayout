import React from "react";
import { useState } from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import "./styles.css";



export default function App() {
  const [divs, setDivs] = useState([
    { name: "1", cat: "b" },
    { name: "2", cat: "b" },
    { name: "3", cat: "b" },
    { name: "4", cat: "b" }
  ]);
  const [rects, setRects] = useState({
    b: { color: "#10B981" },
    w: { color: "#EAB308" },
    r: { color: "#EF4444" },
    f: { color: "#8B5CF6" }
  });

  const setUpDiv = (n, c) => {
    let g = divs.filter((l) => l.name === n.toString() && l.cat === c);
    if (g.length) return;
    let d = [...divs];
    d.map((p) => {
      if (p.name === n.toString()) {
        p.cat = c;
      }
      return p;
    });
    setDivs(d);
  };
  const onViewportBoxUpdate = ({ x }, num) => {
    if (x.min > rects.w.min && x.max < rects.w.max) {
      setUpDiv(num, "w");
    } else if (x.min > rects.b.min && x.max < rects.b.max) {
      setUpDiv(num, "b");
    } else if (x.min > rects.r.min && x.max < rects.r.max) {
      setUpDiv(num, "r");
    } else if (x.min > rects.f.min && x.max < rects.f.max) {
      setUpDiv(num, "f");
    }
  };

  return (
    <AnimateSharedLayout>
      <div className="container">
        {Object.keys(rects).map((i) => {
          return (
            <Zone
              key={i}
              color={rects[i].color}
              comps={divs}
              id={i}
              bound={rects}
              setBound={setRects}
              onViewportBoxUpdate={onViewportBoxUpdate}
            />
          );
        })}
      </div>
    </AnimateSharedLayout>
  );
}

function Zone({
  color,
  comps,
  onViewportBoxUpdate,
  id,
  bound,
  setBound
}) {
  const ref = React.useRef();
  const scrollHandler = (_) => {
    let res = bound;
    if (ref.current.id === id) {
      const clip = ref.current.getBoundingClientRect();
      res[id].min = clip.x;
      res[id].max = clip.x + clip.width;
    }
    setBound(res);
  };

  React.useEffect(() => {}, [id]);

  React.useEffect(() => {
    window.addEventListener("resize", scrollHandler, true);
    scrollHandler();
    return () => {
      window.removeEventListener("resize", scrollHandler, true);
    };
  }, []);
  return (
    <motion.div id={id} ref={ref} className="half-container">
      <motion.div className="overlay" />
      {comps.map((div, ind) => {
        if (id !== div.cat) return null;
        return (
          <motion.div
            className="box"
            layoutId={div.name}
            key={div.name}
            initial={false}
            animate={{ backgroundColor: color }}
            drag
            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={1}
            onViewportBoxUpdate={(e) => onViewportBoxUpdate(e, div.name)}
          ></motion.div>
        );
      })}
    </motion.div>
  );
}
