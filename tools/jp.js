const fs = require("fs");

const SAC = JSON.parse(fs.readFileSync(process.argv[2], "UTF-8")).results.bindings.map(f => {
  Object.keys(f).forEach(k => {
    f[k] = f[k].value;
  });
  return f;
});

const HOKKAIDO = fs.readFileSync(process.argv[3], "UTF-8");
(function() {
  let parent = null;
  HOKKAIDO.split("\n").forEach(line => {
    if (line.match(/^<h2[^>]*><a[^>]*>([^<]+)/)) {
      const name = RegExp.$1;
      parent = SAC.find(f => f.label === name);
    } else if (line.match(/^<p>([^<]+)<\/p>/)) {
      if (parent !== null) {
        RegExp.$1.split("／").map(x => x.trim()).forEach(name => {
          SAC.filter(f => f.label === name && f.areaCode.match(/^01/)).forEach(child => {
            child.parent = parent.areaCode;
          });
        });
        parent = null;
      }
    }
  });
})();

const tree = {
  label: "日本",
  maxZoom: 4
};

(function() {
  const data = {};
  SAC.forEach(f => {
    let target = data[f.areaCode];
    if (target === undefined) {
      target = data[f.areaCode] = {
        areaCode: [f.areaCode],
        label: f.label,
        children: []
      };
    }
    if (target.label !== f.label)
      console.error("label override", target.label, f.label);
    target.label = f.label;
    if (f.next) {
      if (target.next !== undefined && target.next !== f.next)
        console.error("next override", target.next, f.next, target.label);
      target.next = f.next;
    }
    if (f.parent) {
      if (target.parent !== undefined && target.parent !== f.parent)
        console.error("parent override", target.parent, f.parent, target.label);
      target.parent = f.parent;
    }
  });

  const list = Object.values(data);

  list.filter(f => f.parent !== undefined).forEach(f => {
    f.parent = data[f.parent];
    if (f.parent.children === undefined) f.parent.children = [];
    f.parent.children.push(f);
  });

  list.filter(f => f.next !== undefined).forEach(f => {
    let focus = f;
    while (focus.next) {
      const next = data[focus.next];
      focus.areaCode.forEach(a => {
        if (next.areaCode.indexOf(a) === -1) next.areaCode.push(a);
      });
      focus = next;
    }
  });

  list.forEach(f => {
    if (f.label.match(/北海道$/)) f.maxZoom = 6;
    else if (f.label.match(/(都|府|県|振興局)$/)) f.maxZoom = 8;
    else if (f.label.match(/(市|町|村)$/)) {
      if (f.children.length > 0) f.maxZoom = 10;
      else f.maxZoom = 12;
    } else if (f.label.match(/区$/))
      f.maxZoom = 12;
    else if (f.label === "特別区部")
      f.maxZoom = 10;
  });

  const dig = function(f, dst) {
    if (f.next !== undefined) return;
    if (isNaN(f.maxZoom)) {
      f.children.forEach(g => dig(g, dst));
      return;
    }

    const obj = {};
    Object.keys(f).forEach(key => {
      if (["areaCode", "label", "maxZoom"].indexOf(key) !== -1)
        obj[key] = f[key];
    });
    if (dst.children === undefined) dst.children = [];
    dst.children.push(obj);
    f.children.forEach(g => dig(g, obj));
  };
  list.filter(f => f.parent === undefined).forEach(f => dig(f, tree));

})();

console.log(JSON.stringify(tree, null, 2));
