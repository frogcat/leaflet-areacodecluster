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
          const child = SAC.find(f => f.label === name && f.areaCode.match(/^01/));
          child.parent = parent.areaCode;
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
  const children = {};
  SAC.forEach(f => {
    const x = {
      areaCode: f.areaCode,
      label: f.label
    };
    if (f.parent) {
      const k = f.parent;
      if (children[k] === undefined) children[k] = [];
      if (children[k].indexOf(x.areaCode) === -1) children[k].push(x.areaCode);
    }
    const y = data[x.areaCode];
    if (y === undefined) data[x.areaCode] = x;
    else if (y.label !== x.label) console.error("conflict", y);
  });

  const list = Object.values(data);
  list.forEach(f => {
    if (f.label.match(/北海道$/)) f.maxZoom = 6;
    else if (f.label.match(/(都|府|県|振興局)$/)) f.maxZoom = 8;
    else if (f.label.match(/(市|町|村)$/)) {
      if (children[f.areaCode] !== undefined) f.maxZoom = 10;
      else f.maxZoom = 12;
    } else if (f.label.match(/区$/))
      f.maxZoom = 12;
    else if (f.label === "特別区部")
      f.maxZoom = 10;
  });


  const dig = function(f, dst) {
    if (f.maxZoom === undefined) {
      (children[f.areaCode] || []).forEach(g => dig(data[g], dst));
      return;
    }
    if (dst.children === undefined) dst.children = [];
    dst.children.push(f);
    (children[f.areaCode] || []).forEach(g => dig(data[g], f));
  };
  list.filter(f => f.areaCode.match(/000$/)).forEach(f => dig(f, tree));

})();

/*
(function() {
  // 北海道に振興局を挿入
  let key = null;
  HOKKAIDO.split("\n").forEach(line => {
    if (line.match(/^<h2[^>]*><a[^>]*>([^<]+)/)) {
      key = RegExp.$1;
    } else if (line.match(/^<p>([^<]+)<\/p>/)) {
      if (key !== null) {
        tree.children[0].children.push({
          label: key,
          maxZoom: 8,
          children: RegExp.$1.split("／").map(x => {
            return {
              label: x.trim(),
              maxZoom: 10
            };
          })
        });
        key = null;
      }
    }
  });
})();*/
/*
const map = {};



JSON.parse(fs.readFileSync(process.argv[2], "UTF-8")).results.bindings.forEach(x => {
  Object.keys(x).forEach(k => {
    x[k] = x[k].value;
    if (x[k].indexOf("http://") === 0) x[k] = x[k].replace("http://data.e-stat.go.jp/lod/sac/C", "").split("-")[0];
  });

  const key = x.c;
  if (map[key] === undefined) {
    map[key] = {
      id: key,
      label: x.label
    };
  } else {
    if (map[key].label !== x.label)
      console.error("label conflict", map[key].label, x.label);
  }

  if (x.parent !== undefined) {
    if (map[key].parent === undefined) map[key].parent = x.parent;
    else {
      if (map[key].parent !== x.parent)
        console.error("parent conflict", map[key].parent, x.parent);
    }
  }
});

const list = Object.values(map);

const tree = {
  label: "日本"
};

(function() {
  const dig = function(src, parent) {
    let next = parent;
    if (src.label === "特別区部" || src.label.match(/[都道府県市区町村]$/)) {
      next = {
        id: src.id,
        label: src.label
      };
      if (parent.children === undefined) parent.children = [];
      parent.children.push(next);
    }
    list.filter(x => x.parent === src.id).forEach(x => {
      dig(x, next);
    });
  };
  list.filter(x => x.parent === undefined).forEach(x => dig(x, tree));
})();


(function() {
  const hokkaido = {};
  let name = null;
  fs.readFileSync("hokkaido.txt", "UTF-8").split("\n").forEach(x => {
    if (x.match(/振興局$/)) name = x;
    else if (x.indexOf("／") !== -1) hokkaido[name] = x.replace(/ /g, "").split("／");
  });

  const dst = tree.children.find(x => x.label === "北海道");
  dst.children = Object.keys(hokkaido).map(key => {
    const val = hokkaido[key];
    const a = {
      label: key,
      maxZoom: 8,
      children: dst.children.filter(child => val.indexOf(child.label) !== -1)
    };
    return a;
  });
  console.error(dst);
})();

(function() {
  const dig = function(focus, depth) {
    if (focus.children) focus.children.forEach(child => dig(child, depth + 1));

    if (depth === 0) {
      focus.maxZoom = 4;
    } else if (focus.label === "北海道") {
      focus.maxZoom = 6;
    } else if (focus.label.match(/(都|府|県|振興局)$/)) {
      focus.maxZoom = 8;
    } else if (focus.label.match(/(市|町|村)$/)) {
      if (focus.children !== undefined) focus.maxZoom = 10;
      else focus.maxZoom = 12;
    } else if (focus.label.match(/区$/)) {
      focus.maxZoom = 12;
    } else if (focus.label === "特別区部") {
      focus.maxZoom = 10;
    } else {
      console.error(focus.label);
    }
  };
  dig(tree, 0);
})();
*/

console.log(JSON.stringify(tree, null, 2));
