(function () {
  'use strict';

  (function(L) {

    L.AreaCodeCluster = L.FeatureGroup.extend({
      options: {
        pad: 0
      },
      initialize: function(json, markers, options) {
        var this$1 = this;

        this._areaCodeMap = {};
        this._areaCodeList = [];
        var dig = function (f) {
          f.markers = [];
          f.points = [];
          this$1._areaCodeList.push(f);
          if (f.id) { this$1._areaCodeMap[f.id] = f; }
          if (f.children) {
            f.children.forEach(function (g) {
              g.parent = f;
              dig(g);
            });
          }
        };
        dig(json);

        L.Util.setOptions(this, options);
        this._markers = [];
        if (markers)
          { markers.forEach(function (marker) {
            this$1.addMarker(marker);
          }); }
        L.FeatureGroup.prototype.initialize.call(this, []);
      },
      addMarker: function(marker) {
        var areacode = marker.options.areacode;
        if (this._areaCodeMap[areacode])
          { this._areaCodeMap[areacode].markers.push(marker); }
        else { console.error((areacode + " not found"), marker); }
      },
      onAdd: function(map) {
        this._areaCodeList.forEach(function (g) {
          g.points = [];
        });
        this._areaCodeList.filter(function (g) { return g.markers.length > 0; }).forEach(function (g) {
          var points = g.markers.map(function (m) { return m.getLatLng(); });
          var focus = g;
          while (focus) {
            focus.points = focus.points.concat(points);
            focus = focus.parent;
          }
        });
        this._areaCodeList.forEach(function (g) {
          g.count = g.points.length;
          if (g.count > 0) {
            g.point = L.latLng(0, 0);
            g.points.forEach(function (p) {
              g.point.lat += p.lat / g.count;
              g.point.lng += p.lng / g.count;
            });
          }
        });
        this.refresh();
      },
      getEvents: function() {
        return {
          moveend: this.update,
          zoomend: this.refresh,
          viewreset: this.refresh,
          zoomlevelschange: this.refresh
        };
      },
      update: function() {
        var this$1 = this;

        if (!this._map) { return; }
        var bounds = this._map.getBounds().pad(this.options.pad);
        this._markers.forEach(function (marker) {
          if (bounds.contains(marker.getLatLng())) {
            if (!this$1.hasLayer(marker)) { this$1.addLayer(marker); }
          } else {
            if (this$1.hasLayer(marker)) { this$1.removeLayer(marker); }
          }
        });
      },

      refresh: function() {

        if (!this._map) { return; }

        var zoom = this._map.getZoom();

        var markers = [];
        var dig = function (g) {
          if (g.maxZoom < zoom) {
            markers = markers.concat(g.markers);
            if (g.children) { g.children.forEach(dig); }
          } else {
            if (g.count === 0) { return; }

            var className = 'marker-cluster-';
            if (g.count < 10) {
              className += 'small';
            } else if (g.count < 100) {
              className += 'medium';
            } else {
              className += 'large';
            }
            var marker = L.marker(g.point, {
              icon: L.divIcon({
                html: '<div><span>' + g.count + '</span></div>',
                className: 'marker-cluster ' + className,
                iconSize: L.point(40, 40)
              })
            });

            if (g.count > 1) {
              marker.rectangle = L.rectangle(g.points);
              marker.on("mouseover", function() {
                this._map.addLayer(marker.rectangle);
              });
              marker.on("mouseout remove", function() {
                this._map.removeLayer(marker.rectangle);
              });
            }
            marker.on("click", function() {
              this._map.setView(marker.getLatLng(), g.maxZoom + 1);
            });

            var label = (g.id || "") + (g.label || "");
            if (label.length > 0) { marker.bindTooltip(label); }
            markers.push(marker);
          }
        };
        this._areaCodeList.filter(function (f) { return f.parent === undefined; }).forEach(dig);
        this.clearLayers();
        this._markers = markers;
        this.update();
      }
    });

    L.areaCodeCluster = function(json, markers, options) {
      return new L.AreaCodeCluster(json, markers, options);
    };
  })(window.L);

  var label = "日本";
  var children = [
  	{
  		id: "10000",
  		label: "群馬県",
  		children: [
  			{
  				id: "10201",
  				label: "前橋市",
  				maxZoom: 12
  			},
  			{
  				id: "10202",
  				label: "高崎市",
  				maxZoom: 12
  			},
  			{
  				id: "10203",
  				label: "桐生市",
  				maxZoom: 12
  			},
  			{
  				id: "10204",
  				label: "伊勢崎市",
  				maxZoom: 12
  			},
  			{
  				id: "10205",
  				label: "太田市",
  				maxZoom: 12
  			},
  			{
  				id: "10206",
  				label: "沼田市",
  				maxZoom: 12
  			},
  			{
  				id: "10207",
  				label: "館林市",
  				maxZoom: 12
  			},
  			{
  				id: "10208",
  				label: "渋川市",
  				maxZoom: 12
  			},
  			{
  				id: "10209",
  				label: "藤岡市",
  				maxZoom: 12
  			},
  			{
  				id: "10210",
  				label: "富岡市",
  				maxZoom: 12
  			},
  			{
  				id: "10211",
  				label: "安中市",
  				maxZoom: 12
  			},
  			{
  				id: "10212",
  				label: "みどり市",
  				maxZoom: 12
  			},
  			{
  				id: "10344",
  				label: "榛東村",
  				maxZoom: 12
  			},
  			{
  				id: "10345",
  				label: "吉岡町",
  				maxZoom: 12
  			},
  			{
  				id: "10366",
  				label: "上野村",
  				maxZoom: 12
  			},
  			{
  				id: "10367",
  				label: "神流町",
  				maxZoom: 12
  			},
  			{
  				id: "10382",
  				label: "下仁田町",
  				maxZoom: 12
  			},
  			{
  				id: "10383",
  				label: "南牧村",
  				maxZoom: 12
  			},
  			{
  				id: "10384",
  				label: "甘楽町",
  				maxZoom: 12
  			},
  			{
  				id: "10421",
  				label: "中之条町",
  				maxZoom: 12
  			},
  			{
  				id: "10424",
  				label: "長野原町",
  				maxZoom: 12
  			},
  			{
  				id: "10425",
  				label: "嬬恋村",
  				maxZoom: 12
  			},
  			{
  				id: "10426",
  				label: "草津町",
  				maxZoom: 12
  			},
  			{
  				id: "10428",
  				label: "高山村",
  				maxZoom: 12
  			},
  			{
  				id: "10429",
  				label: "東吾妻町",
  				maxZoom: 12
  			},
  			{
  				id: "10443",
  				label: "片品村",
  				maxZoom: 12
  			},
  			{
  				id: "10444",
  				label: "川場村",
  				maxZoom: 12
  			},
  			{
  				id: "10448",
  				label: "昭和村",
  				maxZoom: 12
  			},
  			{
  				id: "10449",
  				label: "みなかみ町",
  				maxZoom: 12
  			},
  			{
  				id: "10464",
  				label: "玉村町",
  				maxZoom: 12
  			},
  			{
  				id: "10521",
  				label: "板倉町",
  				maxZoom: 12
  			},
  			{
  				id: "10522",
  				label: "明和町",
  				maxZoom: 12
  			},
  			{
  				id: "10523",
  				label: "千代田町",
  				maxZoom: 12
  			},
  			{
  				id: "10524",
  				label: "大泉町",
  				maxZoom: 12
  			},
  			{
  				id: "10525",
  				label: "邑楽町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "11000",
  		label: "埼玉県",
  		children: [
  			{
  				id: "11100",
  				label: "さいたま市",
  				children: [
  					{
  						id: "11101",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "11102",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "11103",
  						label: "大宮区",
  						maxZoom: 12
  					},
  					{
  						id: "11104",
  						label: "見沼区",
  						maxZoom: 12
  					},
  					{
  						id: "11105",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "11106",
  						label: "桜区",
  						maxZoom: 12
  					},
  					{
  						id: "11107",
  						label: "浦和区",
  						maxZoom: 12
  					},
  					{
  						id: "11108",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "11109",
  						label: "緑区",
  						maxZoom: 12
  					},
  					{
  						id: "11110",
  						label: "岩槻区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "11201",
  				label: "川越市",
  				maxZoom: 12
  			},
  			{
  				id: "11202",
  				label: "熊谷市",
  				maxZoom: 12
  			},
  			{
  				id: "11203",
  				label: "川口市",
  				maxZoom: 12
  			},
  			{
  				id: "11206",
  				label: "行田市",
  				maxZoom: 12
  			},
  			{
  				id: "11207",
  				label: "秩父市",
  				maxZoom: 12
  			},
  			{
  				id: "11208",
  				label: "所沢市",
  				maxZoom: 12
  			},
  			{
  				id: "11209",
  				label: "飯能市",
  				maxZoom: 12
  			},
  			{
  				id: "11210",
  				label: "加須市",
  				maxZoom: 12
  			},
  			{
  				id: "11211",
  				label: "本庄市",
  				maxZoom: 12
  			},
  			{
  				id: "11212",
  				label: "東松山市",
  				maxZoom: 12
  			},
  			{
  				id: "11214",
  				label: "春日部市",
  				maxZoom: 12
  			},
  			{
  				id: "11215",
  				label: "狭山市",
  				maxZoom: 12
  			},
  			{
  				id: "11216",
  				label: "羽生市",
  				maxZoom: 12
  			},
  			{
  				id: "11217",
  				label: "鴻巣市",
  				maxZoom: 12
  			},
  			{
  				id: "11218",
  				label: "深谷市",
  				maxZoom: 12
  			},
  			{
  				id: "11219",
  				label: "上尾市",
  				maxZoom: 12
  			},
  			{
  				id: "11221",
  				label: "草加市",
  				maxZoom: 12
  			},
  			{
  				id: "11222",
  				label: "越谷市",
  				maxZoom: 12
  			},
  			{
  				id: "11223",
  				label: "蕨市",
  				maxZoom: 12
  			},
  			{
  				id: "11224",
  				label: "戸田市",
  				maxZoom: 12
  			},
  			{
  				id: "11225",
  				label: "入間市",
  				maxZoom: 12
  			},
  			{
  				id: "11227",
  				label: "朝霞市",
  				maxZoom: 12
  			},
  			{
  				id: "11228",
  				label: "志木市",
  				maxZoom: 12
  			},
  			{
  				id: "11229",
  				label: "和光市",
  				maxZoom: 12
  			},
  			{
  				id: "11230",
  				label: "新座市",
  				maxZoom: 12
  			},
  			{
  				id: "11231",
  				label: "桶川市",
  				maxZoom: 12
  			},
  			{
  				id: "11232",
  				label: "久喜市",
  				maxZoom: 12
  			},
  			{
  				id: "11233",
  				label: "北本市",
  				maxZoom: 12
  			},
  			{
  				id: "11234",
  				label: "八潮市",
  				maxZoom: 12
  			},
  			{
  				id: "11235",
  				label: "富士見市",
  				maxZoom: 12
  			},
  			{
  				id: "11237",
  				label: "三郷市",
  				maxZoom: 12
  			},
  			{
  				id: "11238",
  				label: "蓮田市",
  				maxZoom: 12
  			},
  			{
  				id: "11239",
  				label: "坂戸市",
  				maxZoom: 12
  			},
  			{
  				id: "11240",
  				label: "幸手市",
  				maxZoom: 12
  			},
  			{
  				id: "11241",
  				label: "鶴ヶ島市",
  				maxZoom: 12
  			},
  			{
  				id: "11242",
  				label: "日高市",
  				maxZoom: 12
  			},
  			{
  				id: "11243",
  				label: "吉川市",
  				maxZoom: 12
  			},
  			{
  				id: "11245",
  				label: "ふじみ野市",
  				maxZoom: 12
  			},
  			{
  				id: "11246",
  				label: "白岡市",
  				maxZoom: 12
  			},
  			{
  				id: "11301",
  				label: "伊奈町",
  				maxZoom: 12
  			},
  			{
  				id: "11324",
  				label: "三芳町",
  				maxZoom: 12
  			},
  			{
  				id: "11326",
  				label: "毛呂山町",
  				maxZoom: 12
  			},
  			{
  				id: "11327",
  				label: "越生町",
  				maxZoom: 12
  			},
  			{
  				id: "11341",
  				label: "滑川町",
  				maxZoom: 12
  			},
  			{
  				id: "11342",
  				label: "嵐山町",
  				maxZoom: 12
  			},
  			{
  				id: "11343",
  				label: "小川町",
  				maxZoom: 12
  			},
  			{
  				id: "11346",
  				label: "川島町",
  				maxZoom: 12
  			},
  			{
  				id: "11347",
  				label: "吉見町",
  				maxZoom: 12
  			},
  			{
  				id: "11348",
  				label: "鳩山町",
  				maxZoom: 12
  			},
  			{
  				id: "11349",
  				label: "ときがわ町",
  				maxZoom: 12
  			},
  			{
  				id: "11361",
  				label: "横瀬町",
  				maxZoom: 12
  			},
  			{
  				id: "11362",
  				label: "皆野町",
  				maxZoom: 12
  			},
  			{
  				id: "11363",
  				label: "長瀞町",
  				maxZoom: 12
  			},
  			{
  				id: "11365",
  				label: "小鹿野町",
  				maxZoom: 12
  			},
  			{
  				id: "11369",
  				label: "東秩父村",
  				maxZoom: 12
  			},
  			{
  				id: "11381",
  				label: "美里町",
  				maxZoom: 12
  			},
  			{
  				id: "11383",
  				label: "神川町",
  				maxZoom: 12
  			},
  			{
  				id: "11385",
  				label: "上里町",
  				maxZoom: 12
  			},
  			{
  				id: "11408",
  				label: "寄居町",
  				maxZoom: 12
  			},
  			{
  				id: "11442",
  				label: "宮代町",
  				maxZoom: 12
  			},
  			{
  				id: "11464",
  				label: "杉戸町",
  				maxZoom: 12
  			},
  			{
  				id: "11465",
  				label: "松伏町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "12000",
  		label: "千葉県",
  		children: [
  			{
  				id: "12100",
  				label: "千葉市",
  				children: [
  					{
  						id: "12101",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "12102",
  						label: "花見川区",
  						maxZoom: 12
  					},
  					{
  						id: "12103",
  						label: "稲毛区",
  						maxZoom: 12
  					},
  					{
  						id: "12104",
  						label: "若葉区",
  						maxZoom: 12
  					},
  					{
  						id: "12105",
  						label: "緑区",
  						maxZoom: 12
  					},
  					{
  						id: "12106",
  						label: "美浜区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "12202",
  				label: "銚子市",
  				maxZoom: 12
  			},
  			{
  				id: "12203",
  				label: "市川市",
  				maxZoom: 12
  			},
  			{
  				id: "12204",
  				label: "船橋市",
  				maxZoom: 12
  			},
  			{
  				id: "12205",
  				label: "館山市",
  				maxZoom: 12
  			},
  			{
  				id: "12206",
  				label: "木更津市",
  				maxZoom: 12
  			},
  			{
  				id: "12207",
  				label: "松戸市",
  				maxZoom: 12
  			},
  			{
  				id: "12208",
  				label: "野田市",
  				maxZoom: 12
  			},
  			{
  				id: "12210",
  				label: "茂原市",
  				maxZoom: 12
  			},
  			{
  				id: "12211",
  				label: "成田市",
  				maxZoom: 12
  			},
  			{
  				id: "12212",
  				label: "佐倉市",
  				maxZoom: 12
  			},
  			{
  				id: "12213",
  				label: "東金市",
  				maxZoom: 12
  			},
  			{
  				id: "12215",
  				label: "旭市",
  				maxZoom: 12
  			},
  			{
  				id: "12216",
  				label: "習志野市",
  				maxZoom: 12
  			},
  			{
  				id: "12217",
  				label: "柏市",
  				maxZoom: 12
  			},
  			{
  				id: "12218",
  				label: "勝浦市",
  				maxZoom: 12
  			},
  			{
  				id: "12219",
  				label: "市原市",
  				maxZoom: 12
  			},
  			{
  				id: "12220",
  				label: "流山市",
  				maxZoom: 12
  			},
  			{
  				id: "12221",
  				label: "八千代市",
  				maxZoom: 12
  			},
  			{
  				id: "12222",
  				label: "我孫子市",
  				maxZoom: 12
  			},
  			{
  				id: "12223",
  				label: "鴨川市",
  				maxZoom: 12
  			},
  			{
  				id: "12224",
  				label: "鎌ケ谷市",
  				maxZoom: 12
  			},
  			{
  				id: "12225",
  				label: "君津市",
  				maxZoom: 12
  			},
  			{
  				id: "12226",
  				label: "富津市",
  				maxZoom: 12
  			},
  			{
  				id: "12227",
  				label: "浦安市",
  				maxZoom: 12
  			},
  			{
  				id: "12228",
  				label: "四街道市",
  				maxZoom: 12
  			},
  			{
  				id: "12229",
  				label: "袖ケ浦市",
  				maxZoom: 12
  			},
  			{
  				id: "12230",
  				label: "八街市",
  				maxZoom: 12
  			},
  			{
  				id: "12231",
  				label: "印西市",
  				maxZoom: 12
  			},
  			{
  				id: "12232",
  				label: "白井市",
  				maxZoom: 12
  			},
  			{
  				id: "12233",
  				label: "富里市",
  				maxZoom: 12
  			},
  			{
  				id: "12234",
  				label: "南房総市",
  				maxZoom: 12
  			},
  			{
  				id: "12235",
  				label: "匝瑳市",
  				maxZoom: 12
  			},
  			{
  				id: "12236",
  				label: "香取市",
  				maxZoom: 12
  			},
  			{
  				id: "12237",
  				label: "山武市",
  				maxZoom: 12
  			},
  			{
  				id: "12238",
  				label: "いすみ市",
  				maxZoom: 12
  			},
  			{
  				id: "12239",
  				label: "大網白里市",
  				maxZoom: 12
  			},
  			{
  				id: "12322",
  				label: "酒々井町",
  				maxZoom: 12
  			},
  			{
  				id: "12329",
  				label: "栄町",
  				maxZoom: 12
  			},
  			{
  				id: "12342",
  				label: "神崎町",
  				maxZoom: 12
  			},
  			{
  				id: "12347",
  				label: "多古町",
  				maxZoom: 12
  			},
  			{
  				id: "12349",
  				label: "東庄町",
  				maxZoom: 12
  			},
  			{
  				id: "12403",
  				label: "九十九里町",
  				maxZoom: 12
  			},
  			{
  				id: "12409",
  				label: "芝山町",
  				maxZoom: 12
  			},
  			{
  				id: "12410",
  				label: "横芝光町",
  				maxZoom: 12
  			},
  			{
  				id: "12421",
  				label: "一宮町",
  				maxZoom: 12
  			},
  			{
  				id: "12422",
  				label: "睦沢町",
  				maxZoom: 12
  			},
  			{
  				id: "12423",
  				label: "長生村",
  				maxZoom: 12
  			},
  			{
  				id: "12424",
  				label: "白子町",
  				maxZoom: 12
  			},
  			{
  				id: "12426",
  				label: "長柄町",
  				maxZoom: 12
  			},
  			{
  				id: "12427",
  				label: "長南町",
  				maxZoom: 12
  			},
  			{
  				id: "12441",
  				label: "大多喜町",
  				maxZoom: 12
  			},
  			{
  				id: "12443",
  				label: "御宿町",
  				maxZoom: 12
  			},
  			{
  				id: "12463",
  				label: "鋸南町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "13000",
  		label: "東京都",
  		children: [
  			{
  				id: "13100",
  				label: "特別区部",
  				children: [
  					{
  						id: "13101",
  						label: "千代田区",
  						maxZoom: 12
  					},
  					{
  						id: "13102",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "13103",
  						label: "港区",
  						maxZoom: 12
  					},
  					{
  						id: "13104",
  						label: "新宿区",
  						maxZoom: 12
  					},
  					{
  						id: "13105",
  						label: "文京区",
  						maxZoom: 12
  					},
  					{
  						id: "13106",
  						label: "台東区",
  						maxZoom: 12
  					},
  					{
  						id: "13107",
  						label: "墨田区",
  						maxZoom: 12
  					},
  					{
  						id: "13108",
  						label: "江東区",
  						maxZoom: 12
  					},
  					{
  						id: "13109",
  						label: "品川区",
  						maxZoom: 12
  					},
  					{
  						id: "13110",
  						label: "目黒区",
  						maxZoom: 12
  					},
  					{
  						id: "13111",
  						label: "大田区",
  						maxZoom: 12
  					},
  					{
  						id: "13112",
  						label: "世田谷区",
  						maxZoom: 12
  					},
  					{
  						id: "13113",
  						label: "渋谷区",
  						maxZoom: 12
  					},
  					{
  						id: "13114",
  						label: "中野区",
  						maxZoom: 12
  					},
  					{
  						id: "13115",
  						label: "杉並区",
  						maxZoom: 12
  					},
  					{
  						id: "13116",
  						label: "豊島区",
  						maxZoom: 12
  					},
  					{
  						id: "13117",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "13118",
  						label: "荒川区",
  						maxZoom: 12
  					},
  					{
  						id: "13119",
  						label: "板橋区",
  						maxZoom: 12
  					},
  					{
  						id: "13120",
  						label: "練馬区",
  						maxZoom: 12
  					},
  					{
  						id: "13121",
  						label: "足立区",
  						maxZoom: 12
  					},
  					{
  						id: "13122",
  						label: "葛飾区",
  						maxZoom: 12
  					},
  					{
  						id: "13123",
  						label: "江戸川区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "13201",
  				label: "八王子市",
  				maxZoom: 12
  			},
  			{
  				id: "13202",
  				label: "立川市",
  				maxZoom: 12
  			},
  			{
  				id: "13203",
  				label: "武蔵野市",
  				maxZoom: 12
  			},
  			{
  				id: "13204",
  				label: "三鷹市",
  				maxZoom: 12
  			},
  			{
  				id: "13205",
  				label: "青梅市",
  				maxZoom: 12
  			},
  			{
  				id: "13206",
  				label: "府中市",
  				maxZoom: 12
  			},
  			{
  				id: "13207",
  				label: "昭島市",
  				maxZoom: 12
  			},
  			{
  				id: "13208",
  				label: "調布市",
  				maxZoom: 12
  			},
  			{
  				id: "13209",
  				label: "町田市",
  				maxZoom: 12
  			},
  			{
  				id: "13210",
  				label: "小金井市",
  				maxZoom: 12
  			},
  			{
  				id: "13211",
  				label: "小平市",
  				maxZoom: 12
  			},
  			{
  				id: "13212",
  				label: "日野市",
  				maxZoom: 12
  			},
  			{
  				id: "13213",
  				label: "東村山市",
  				maxZoom: 12
  			},
  			{
  				id: "13214",
  				label: "国分寺市",
  				maxZoom: 12
  			},
  			{
  				id: "13215",
  				label: "国立市",
  				maxZoom: 12
  			},
  			{
  				id: "13218",
  				label: "福生市",
  				maxZoom: 12
  			},
  			{
  				id: "13219",
  				label: "狛江市",
  				maxZoom: 12
  			},
  			{
  				id: "13220",
  				label: "東大和市",
  				maxZoom: 12
  			},
  			{
  				id: "13221",
  				label: "清瀬市",
  				maxZoom: 12
  			},
  			{
  				id: "13222",
  				label: "東久留米市",
  				maxZoom: 12
  			},
  			{
  				id: "13223",
  				label: "武蔵村山市",
  				maxZoom: 12
  			},
  			{
  				id: "13224",
  				label: "多摩市",
  				maxZoom: 12
  			},
  			{
  				id: "13225",
  				label: "稲城市",
  				maxZoom: 12
  			},
  			{
  				id: "13227",
  				label: "羽村市",
  				maxZoom: 12
  			},
  			{
  				id: "13228",
  				label: "あきる野市",
  				maxZoom: 12
  			},
  			{
  				id: "13229",
  				label: "西東京市",
  				maxZoom: 12
  			},
  			{
  				id: "13303",
  				label: "瑞穂町",
  				maxZoom: 12
  			},
  			{
  				id: "13305",
  				label: "日の出町",
  				maxZoom: 12
  			},
  			{
  				id: "13307",
  				label: "檜原村",
  				maxZoom: 12
  			},
  			{
  				id: "13308",
  				label: "奥多摩町",
  				maxZoom: 12
  			},
  			{
  				id: "13361",
  				label: "大島町",
  				maxZoom: 12
  			},
  			{
  				id: "13362",
  				label: "利島村",
  				maxZoom: 12
  			},
  			{
  				id: "13363",
  				label: "新島村",
  				maxZoom: 12
  			},
  			{
  				id: "13364",
  				label: "神津島村",
  				maxZoom: 12
  			},
  			{
  				id: "13381",
  				label: "三宅村",
  				maxZoom: 12
  			},
  			{
  				id: "13382",
  				label: "御蔵島村",
  				maxZoom: 12
  			},
  			{
  				id: "13401",
  				label: "八丈町",
  				maxZoom: 12
  			},
  			{
  				id: "13402",
  				label: "青ヶ島村",
  				maxZoom: 12
  			},
  			{
  				id: "13421",
  				label: "小笠原村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "14000",
  		label: "神奈川県",
  		children: [
  			{
  				id: "14100",
  				label: "横浜市",
  				children: [
  					{
  						id: "14101",
  						label: "鶴見区",
  						maxZoom: 12
  					},
  					{
  						id: "14102",
  						label: "神奈川区",
  						maxZoom: 12
  					},
  					{
  						id: "14103",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "14104",
  						label: "中区",
  						maxZoom: 12
  					},
  					{
  						id: "14105",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "14106",
  						label: "保土ケ谷区",
  						maxZoom: 12
  					},
  					{
  						id: "14107",
  						label: "磯子区",
  						maxZoom: 12
  					},
  					{
  						id: "14108",
  						label: "金沢区",
  						maxZoom: 12
  					},
  					{
  						id: "14109",
  						label: "港北区",
  						maxZoom: 12
  					},
  					{
  						id: "14110",
  						label: "戸塚区",
  						maxZoom: 12
  					},
  					{
  						id: "14111",
  						label: "港南区",
  						maxZoom: 12
  					},
  					{
  						id: "14112",
  						label: "旭区",
  						maxZoom: 12
  					},
  					{
  						id: "14113",
  						label: "緑区",
  						maxZoom: 12
  					},
  					{
  						id: "14114",
  						label: "瀬谷区",
  						maxZoom: 12
  					},
  					{
  						id: "14115",
  						label: "栄区",
  						maxZoom: 12
  					},
  					{
  						id: "14116",
  						label: "泉区",
  						maxZoom: 12
  					},
  					{
  						id: "14117",
  						label: "青葉区",
  						maxZoom: 12
  					},
  					{
  						id: "14118",
  						label: "都筑区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "14130",
  				label: "川崎市",
  				children: [
  					{
  						id: "14131",
  						label: "川崎区",
  						maxZoom: 12
  					},
  					{
  						id: "14132",
  						label: "幸区",
  						maxZoom: 12
  					},
  					{
  						id: "14133",
  						label: "中原区",
  						maxZoom: 12
  					},
  					{
  						id: "14134",
  						label: "高津区",
  						maxZoom: 12
  					},
  					{
  						id: "14135",
  						label: "多摩区",
  						maxZoom: 12
  					},
  					{
  						id: "14136",
  						label: "宮前区",
  						maxZoom: 12
  					},
  					{
  						id: "14137",
  						label: "麻生区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "14150",
  				label: "相模原市",
  				children: [
  					{
  						id: "14151",
  						label: "緑区",
  						maxZoom: 12
  					},
  					{
  						id: "14152",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "14153",
  						label: "南区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "14201",
  				label: "横須賀市",
  				maxZoom: 12
  			},
  			{
  				id: "14203",
  				label: "平塚市",
  				maxZoom: 12
  			},
  			{
  				id: "14204",
  				label: "鎌倉市",
  				maxZoom: 12
  			},
  			{
  				id: "14205",
  				label: "藤沢市",
  				maxZoom: 12
  			},
  			{
  				id: "14206",
  				label: "小田原市",
  				maxZoom: 12
  			},
  			{
  				id: "14207",
  				label: "茅ヶ崎市",
  				maxZoom: 12
  			},
  			{
  				id: "14208",
  				label: "逗子市",
  				maxZoom: 12
  			},
  			{
  				id: "14210",
  				label: "三浦市",
  				maxZoom: 12
  			},
  			{
  				id: "14211",
  				label: "秦野市",
  				maxZoom: 12
  			},
  			{
  				id: "14212",
  				label: "厚木市",
  				maxZoom: 12
  			},
  			{
  				id: "14213",
  				label: "大和市",
  				maxZoom: 12
  			},
  			{
  				id: "14214",
  				label: "伊勢原市",
  				maxZoom: 12
  			},
  			{
  				id: "14215",
  				label: "海老名市",
  				maxZoom: 12
  			},
  			{
  				id: "14216",
  				label: "座間市",
  				maxZoom: 12
  			},
  			{
  				id: "14217",
  				label: "南足柄市",
  				maxZoom: 12
  			},
  			{
  				id: "14218",
  				label: "綾瀬市",
  				maxZoom: 12
  			},
  			{
  				id: "14301",
  				label: "葉山町",
  				maxZoom: 12
  			},
  			{
  				id: "14321",
  				label: "寒川町",
  				maxZoom: 12
  			},
  			{
  				id: "14341",
  				label: "大磯町",
  				maxZoom: 12
  			},
  			{
  				id: "14342",
  				label: "二宮町",
  				maxZoom: 12
  			},
  			{
  				id: "14361",
  				label: "中井町",
  				maxZoom: 12
  			},
  			{
  				id: "14362",
  				label: "大井町",
  				maxZoom: 12
  			},
  			{
  				id: "14363",
  				label: "松田町",
  				maxZoom: 12
  			},
  			{
  				id: "14364",
  				label: "山北町",
  				maxZoom: 12
  			},
  			{
  				id: "14366",
  				label: "開成町",
  				maxZoom: 12
  			},
  			{
  				id: "14382",
  				label: "箱根町",
  				maxZoom: 12
  			},
  			{
  				id: "14383",
  				label: "真鶴町",
  				maxZoom: 12
  			},
  			{
  				id: "14384",
  				label: "湯河原町",
  				maxZoom: 12
  			},
  			{
  				id: "14401",
  				label: "愛川町",
  				maxZoom: 12
  			},
  			{
  				id: "14402",
  				label: "清川村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "15000",
  		label: "新潟県",
  		children: [
  			{
  				id: "15100",
  				label: "新潟市",
  				children: [
  					{
  						id: "15101",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "15102",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "15103",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "15104",
  						label: "江南区",
  						maxZoom: 12
  					},
  					{
  						id: "15105",
  						label: "秋葉区",
  						maxZoom: 12
  					},
  					{
  						id: "15106",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "15107",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "15108",
  						label: "西蒲区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "15202",
  				label: "長岡市",
  				maxZoom: 12
  			},
  			{
  				id: "15204",
  				label: "三条市",
  				maxZoom: 12
  			},
  			{
  				id: "15205",
  				label: "柏崎市",
  				maxZoom: 12
  			},
  			{
  				id: "15206",
  				label: "新発田市",
  				maxZoom: 12
  			},
  			{
  				id: "15208",
  				label: "小千谷市",
  				maxZoom: 12
  			},
  			{
  				id: "15209",
  				label: "加茂市",
  				maxZoom: 12
  			},
  			{
  				id: "15210",
  				label: "十日町市",
  				maxZoom: 12
  			},
  			{
  				id: "15211",
  				label: "見附市",
  				maxZoom: 12
  			},
  			{
  				id: "15212",
  				label: "村上市",
  				maxZoom: 12
  			},
  			{
  				id: "15213",
  				label: "燕市",
  				maxZoom: 12
  			},
  			{
  				id: "15216",
  				label: "糸魚川市",
  				maxZoom: 12
  			},
  			{
  				id: "15217",
  				label: "妙高市",
  				maxZoom: 12
  			},
  			{
  				id: "15218",
  				label: "五泉市",
  				maxZoom: 12
  			},
  			{
  				id: "15222",
  				label: "上越市",
  				maxZoom: 12
  			},
  			{
  				id: "15223",
  				label: "阿賀野市",
  				maxZoom: 12
  			},
  			{
  				id: "15224",
  				label: "佐渡市",
  				maxZoom: 12
  			},
  			{
  				id: "15225",
  				label: "魚沼市",
  				maxZoom: 12
  			},
  			{
  				id: "15226",
  				label: "南魚沼市",
  				maxZoom: 12
  			},
  			{
  				id: "15227",
  				label: "胎内市",
  				maxZoom: 12
  			},
  			{
  				id: "15307",
  				label: "聖籠町",
  				maxZoom: 12
  			},
  			{
  				id: "15342",
  				label: "弥彦村",
  				maxZoom: 12
  			},
  			{
  				id: "15361",
  				label: "田上町",
  				maxZoom: 12
  			},
  			{
  				id: "15385",
  				label: "阿賀町",
  				maxZoom: 12
  			},
  			{
  				id: "15405",
  				label: "出雲崎町",
  				maxZoom: 12
  			},
  			{
  				id: "15461",
  				label: "湯沢町",
  				maxZoom: 12
  			},
  			{
  				id: "15482",
  				label: "津南町",
  				maxZoom: 12
  			},
  			{
  				id: "15504",
  				label: "刈羽村",
  				maxZoom: 12
  			},
  			{
  				id: "15581",
  				label: "関川村",
  				maxZoom: 12
  			},
  			{
  				id: "15586",
  				label: "粟島浦村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "16000",
  		label: "富山県",
  		children: [
  			{
  				id: "16201",
  				label: "富山市",
  				maxZoom: 12
  			},
  			{
  				id: "16202",
  				label: "高岡市",
  				maxZoom: 12
  			},
  			{
  				id: "16204",
  				label: "魚津市",
  				maxZoom: 12
  			},
  			{
  				id: "16205",
  				label: "氷見市",
  				maxZoom: 12
  			},
  			{
  				id: "16206",
  				label: "滑川市",
  				maxZoom: 12
  			},
  			{
  				id: "16207",
  				label: "黒部市",
  				maxZoom: 12
  			},
  			{
  				id: "16208",
  				label: "砺波市",
  				maxZoom: 12
  			},
  			{
  				id: "16209",
  				label: "小矢部市",
  				maxZoom: 12
  			},
  			{
  				id: "16210",
  				label: "南砺市",
  				maxZoom: 12
  			},
  			{
  				id: "16211",
  				label: "射水市",
  				maxZoom: 12
  			},
  			{
  				id: "16321",
  				label: "舟橋村",
  				maxZoom: 12
  			},
  			{
  				id: "16322",
  				label: "上市町",
  				maxZoom: 12
  			},
  			{
  				id: "16323",
  				label: "立山町",
  				maxZoom: 12
  			},
  			{
  				id: "16342",
  				label: "入善町",
  				maxZoom: 12
  			},
  			{
  				id: "16343",
  				label: "朝日町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "17000",
  		label: "石川県",
  		children: [
  			{
  				id: "17201",
  				label: "金沢市",
  				maxZoom: 12
  			},
  			{
  				id: "17202",
  				label: "七尾市",
  				maxZoom: 12
  			},
  			{
  				id: "17203",
  				label: "小松市",
  				maxZoom: 12
  			},
  			{
  				id: "17204",
  				label: "輪島市",
  				maxZoom: 12
  			},
  			{
  				id: "17205",
  				label: "珠洲市",
  				maxZoom: 12
  			},
  			{
  				id: "17206",
  				label: "加賀市",
  				maxZoom: 12
  			},
  			{
  				id: "17207",
  				label: "羽咋市",
  				maxZoom: 12
  			},
  			{
  				id: "17209",
  				label: "かほく市",
  				maxZoom: 12
  			},
  			{
  				id: "17210",
  				label: "白山市",
  				maxZoom: 12
  			},
  			{
  				id: "17211",
  				label: "能美市",
  				maxZoom: 12
  			},
  			{
  				id: "17212",
  				label: "野々市市",
  				maxZoom: 12
  			},
  			{
  				id: "17324",
  				label: "川北町",
  				maxZoom: 12
  			},
  			{
  				id: "17361",
  				label: "津幡町",
  				maxZoom: 12
  			},
  			{
  				id: "17365",
  				label: "内灘町",
  				maxZoom: 12
  			},
  			{
  				id: "17384",
  				label: "志賀町",
  				maxZoom: 12
  			},
  			{
  				id: "17386",
  				label: "宝達志水町",
  				maxZoom: 12
  			},
  			{
  				id: "17407",
  				label: "中能登町",
  				maxZoom: 12
  			},
  			{
  				id: "17461",
  				label: "穴水町",
  				maxZoom: 12
  			},
  			{
  				id: "17463",
  				label: "能登町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "18000",
  		label: "福井県",
  		children: [
  			{
  				id: "18201",
  				label: "福井市",
  				maxZoom: 12
  			},
  			{
  				id: "18202",
  				label: "敦賀市",
  				maxZoom: 12
  			},
  			{
  				id: "18204",
  				label: "小浜市",
  				maxZoom: 12
  			},
  			{
  				id: "18205",
  				label: "大野市",
  				maxZoom: 12
  			},
  			{
  				id: "18206",
  				label: "勝山市",
  				maxZoom: 12
  			},
  			{
  				id: "18207",
  				label: "鯖江市",
  				maxZoom: 12
  			},
  			{
  				id: "18208",
  				label: "あわら市",
  				maxZoom: 12
  			},
  			{
  				id: "18209",
  				label: "越前市",
  				maxZoom: 12
  			},
  			{
  				id: "18210",
  				label: "坂井市",
  				maxZoom: 12
  			},
  			{
  				id: "18322",
  				label: "永平寺町",
  				maxZoom: 12
  			},
  			{
  				id: "18382",
  				label: "池田町",
  				maxZoom: 12
  			},
  			{
  				id: "18404",
  				label: "南越前町",
  				maxZoom: 12
  			},
  			{
  				id: "18423",
  				label: "越前町",
  				maxZoom: 12
  			},
  			{
  				id: "18442",
  				label: "美浜町",
  				maxZoom: 12
  			},
  			{
  				id: "18481",
  				label: "高浜町",
  				maxZoom: 12
  			},
  			{
  				id: "18483",
  				label: "おおい町",
  				maxZoom: 12
  			},
  			{
  				id: "18501",
  				label: "若狭町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "19000",
  		label: "山梨県",
  		children: [
  			{
  				id: "19201",
  				label: "甲府市",
  				maxZoom: 12
  			},
  			{
  				id: "19202",
  				label: "富士吉田市",
  				maxZoom: 12
  			},
  			{
  				id: "19204",
  				label: "都留市",
  				maxZoom: 12
  			},
  			{
  				id: "19205",
  				label: "山梨市",
  				maxZoom: 12
  			},
  			{
  				id: "19206",
  				label: "大月市",
  				maxZoom: 12
  			},
  			{
  				id: "19207",
  				label: "韮崎市",
  				maxZoom: 12
  			},
  			{
  				id: "19208",
  				label: "南アルプス市",
  				maxZoom: 12
  			},
  			{
  				id: "19209",
  				label: "北杜市",
  				maxZoom: 12
  			},
  			{
  				id: "19210",
  				label: "甲斐市",
  				maxZoom: 12
  			},
  			{
  				id: "19211",
  				label: "笛吹市",
  				maxZoom: 12
  			},
  			{
  				id: "19212",
  				label: "上野原市",
  				maxZoom: 12
  			},
  			{
  				id: "19213",
  				label: "甲州市",
  				maxZoom: 12
  			},
  			{
  				id: "19214",
  				label: "中央市",
  				maxZoom: 12
  			},
  			{
  				id: "19346",
  				label: "市川三郷町",
  				maxZoom: 12
  			},
  			{
  				id: "19364",
  				label: "早川町",
  				maxZoom: 12
  			},
  			{
  				id: "19365",
  				label: "身延町",
  				maxZoom: 12
  			},
  			{
  				id: "19366",
  				label: "南部町",
  				maxZoom: 12
  			},
  			{
  				id: "19368",
  				label: "富士川町",
  				maxZoom: 12
  			},
  			{
  				id: "19384",
  				label: "昭和町",
  				maxZoom: 12
  			},
  			{
  				id: "19422",
  				label: "道志村",
  				maxZoom: 12
  			},
  			{
  				id: "19423",
  				label: "西桂町",
  				maxZoom: 12
  			},
  			{
  				id: "19424",
  				label: "忍野村",
  				maxZoom: 12
  			},
  			{
  				id: "19425",
  				label: "山中湖村",
  				maxZoom: 12
  			},
  			{
  				id: "19429",
  				label: "鳴沢村",
  				maxZoom: 12
  			},
  			{
  				id: "19430",
  				label: "富士河口湖町",
  				maxZoom: 12
  			},
  			{
  				id: "19442",
  				label: "小菅村",
  				maxZoom: 12
  			},
  			{
  				id: "19443",
  				label: "丹波山村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "20000",
  		label: "長野県",
  		children: [
  			{
  				id: "20201",
  				label: "長野市",
  				maxZoom: 12
  			},
  			{
  				id: "20202",
  				label: "松本市",
  				maxZoom: 12
  			},
  			{
  				id: "20203",
  				label: "上田市",
  				maxZoom: 12
  			},
  			{
  				id: "20204",
  				label: "岡谷市",
  				maxZoom: 12
  			},
  			{
  				id: "20205",
  				label: "飯田市",
  				maxZoom: 12
  			},
  			{
  				id: "20206",
  				label: "諏訪市",
  				maxZoom: 12
  			},
  			{
  				id: "20207",
  				label: "須坂市",
  				maxZoom: 12
  			},
  			{
  				id: "20208",
  				label: "小諸市",
  				maxZoom: 12
  			},
  			{
  				id: "20209",
  				label: "伊那市",
  				maxZoom: 12
  			},
  			{
  				id: "20210",
  				label: "駒ヶ根市",
  				maxZoom: 12
  			},
  			{
  				id: "20211",
  				label: "中野市",
  				maxZoom: 12
  			},
  			{
  				id: "20212",
  				label: "大町市",
  				maxZoom: 12
  			},
  			{
  				id: "20213",
  				label: "飯山市",
  				maxZoom: 12
  			},
  			{
  				id: "20214",
  				label: "茅野市",
  				maxZoom: 12
  			},
  			{
  				id: "20215",
  				label: "塩尻市",
  				maxZoom: 12
  			},
  			{
  				id: "20217",
  				label: "佐久市",
  				maxZoom: 12
  			},
  			{
  				id: "20218",
  				label: "千曲市",
  				maxZoom: 12
  			},
  			{
  				id: "20219",
  				label: "東御市",
  				maxZoom: 12
  			},
  			{
  				id: "20220",
  				label: "安曇野市",
  				maxZoom: 12
  			},
  			{
  				id: "20303",
  				label: "小海町",
  				maxZoom: 12
  			},
  			{
  				id: "20304",
  				label: "川上村",
  				maxZoom: 12
  			},
  			{
  				id: "20305",
  				label: "南牧村",
  				maxZoom: 12
  			},
  			{
  				id: "20306",
  				label: "南相木村",
  				maxZoom: 12
  			},
  			{
  				id: "20307",
  				label: "北相木村",
  				maxZoom: 12
  			},
  			{
  				id: "20309",
  				label: "佐久穂町",
  				maxZoom: 12
  			},
  			{
  				id: "20321",
  				label: "軽井沢町",
  				maxZoom: 12
  			},
  			{
  				id: "20323",
  				label: "御代田町",
  				maxZoom: 12
  			},
  			{
  				id: "20324",
  				label: "立科町",
  				maxZoom: 12
  			},
  			{
  				id: "20349",
  				label: "青木村",
  				maxZoom: 12
  			},
  			{
  				id: "20350",
  				label: "長和町",
  				maxZoom: 12
  			},
  			{
  				id: "20361",
  				label: "下諏訪町",
  				maxZoom: 12
  			},
  			{
  				id: "20362",
  				label: "富士見町",
  				maxZoom: 12
  			},
  			{
  				id: "20363",
  				label: "原村",
  				maxZoom: 12
  			},
  			{
  				id: "20382",
  				label: "辰野町",
  				maxZoom: 12
  			},
  			{
  				id: "20383",
  				label: "箕輪町",
  				maxZoom: 12
  			},
  			{
  				id: "20384",
  				label: "飯島町",
  				maxZoom: 12
  			},
  			{
  				id: "20385",
  				label: "南箕輪村",
  				maxZoom: 12
  			},
  			{
  				id: "20386",
  				label: "中川村",
  				maxZoom: 12
  			},
  			{
  				id: "20388",
  				label: "宮田村",
  				maxZoom: 12
  			},
  			{
  				id: "20402",
  				label: "松川町",
  				maxZoom: 12
  			},
  			{
  				id: "20403",
  				label: "高森町",
  				maxZoom: 12
  			},
  			{
  				id: "20404",
  				label: "阿南町",
  				maxZoom: 12
  			},
  			{
  				id: "20407",
  				label: "阿智村",
  				maxZoom: 12
  			},
  			{
  				id: "20409",
  				label: "平谷村",
  				maxZoom: 12
  			},
  			{
  				id: "20410",
  				label: "根羽村",
  				maxZoom: 12
  			},
  			{
  				id: "20411",
  				label: "下條村",
  				maxZoom: 12
  			},
  			{
  				id: "20412",
  				label: "売木村",
  				maxZoom: 12
  			},
  			{
  				id: "20413",
  				label: "天龍村",
  				maxZoom: 12
  			},
  			{
  				id: "20414",
  				label: "泰阜村",
  				maxZoom: 12
  			},
  			{
  				id: "20415",
  				label: "喬木村",
  				maxZoom: 12
  			},
  			{
  				id: "20416",
  				label: "豊丘村",
  				maxZoom: 12
  			},
  			{
  				id: "20417",
  				label: "大鹿村",
  				maxZoom: 12
  			},
  			{
  				id: "20422",
  				label: "上松町",
  				maxZoom: 12
  			},
  			{
  				id: "20423",
  				label: "南木曽町",
  				maxZoom: 12
  			},
  			{
  				id: "20425",
  				label: "木祖村",
  				maxZoom: 12
  			},
  			{
  				id: "20429",
  				label: "王滝村",
  				maxZoom: 12
  			},
  			{
  				id: "20430",
  				label: "大桑村",
  				maxZoom: 12
  			},
  			{
  				id: "20432",
  				label: "木曽町",
  				maxZoom: 12
  			},
  			{
  				id: "20446",
  				label: "麻績村",
  				maxZoom: 12
  			},
  			{
  				id: "20448",
  				label: "生坂村",
  				maxZoom: 12
  			},
  			{
  				id: "20450",
  				label: "山形村",
  				maxZoom: 12
  			},
  			{
  				id: "20451",
  				label: "朝日村",
  				maxZoom: 12
  			},
  			{
  				id: "20452",
  				label: "筑北村",
  				maxZoom: 12
  			},
  			{
  				id: "20481",
  				label: "池田町",
  				maxZoom: 12
  			},
  			{
  				id: "20482",
  				label: "松川村",
  				maxZoom: 12
  			},
  			{
  				id: "20485",
  				label: "白馬村",
  				maxZoom: 12
  			},
  			{
  				id: "20486",
  				label: "小谷村",
  				maxZoom: 12
  			},
  			{
  				id: "20521",
  				label: "坂城町",
  				maxZoom: 12
  			},
  			{
  				id: "20541",
  				label: "小布施町",
  				maxZoom: 12
  			},
  			{
  				id: "20543",
  				label: "高山村",
  				maxZoom: 12
  			},
  			{
  				id: "20561",
  				label: "山ノ内町",
  				maxZoom: 12
  			},
  			{
  				id: "20562",
  				label: "木島平村",
  				maxZoom: 12
  			},
  			{
  				id: "20563",
  				label: "野沢温泉村",
  				maxZoom: 12
  			},
  			{
  				id: "20583",
  				label: "信濃町",
  				maxZoom: 12
  			},
  			{
  				id: "20588",
  				label: "小川村",
  				maxZoom: 12
  			},
  			{
  				id: "20590",
  				label: "飯綱町",
  				maxZoom: 12
  			},
  			{
  				id: "20602",
  				label: "栄村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "21000",
  		label: "岐阜県",
  		children: [
  			{
  				id: "21201",
  				label: "岐阜市",
  				maxZoom: 12
  			},
  			{
  				id: "21202",
  				label: "大垣市",
  				maxZoom: 12
  			},
  			{
  				id: "21203",
  				label: "高山市",
  				maxZoom: 12
  			},
  			{
  				id: "21204",
  				label: "多治見市",
  				maxZoom: 12
  			},
  			{
  				id: "21205",
  				label: "関市",
  				maxZoom: 12
  			},
  			{
  				id: "21206",
  				label: "中津川市",
  				maxZoom: 12
  			},
  			{
  				id: "21207",
  				label: "美濃市",
  				maxZoom: 12
  			},
  			{
  				id: "21208",
  				label: "瑞浪市",
  				maxZoom: 12
  			},
  			{
  				id: "21209",
  				label: "羽島市",
  				maxZoom: 12
  			},
  			{
  				id: "21210",
  				label: "恵那市",
  				maxZoom: 12
  			},
  			{
  				id: "21211",
  				label: "美濃加茂市",
  				maxZoom: 12
  			},
  			{
  				id: "21212",
  				label: "土岐市",
  				maxZoom: 12
  			},
  			{
  				id: "21213",
  				label: "各務原市",
  				maxZoom: 12
  			},
  			{
  				id: "21214",
  				label: "可児市",
  				maxZoom: 12
  			},
  			{
  				id: "21215",
  				label: "山県市",
  				maxZoom: 12
  			},
  			{
  				id: "21216",
  				label: "瑞穂市",
  				maxZoom: 12
  			},
  			{
  				id: "21217",
  				label: "飛騨市",
  				maxZoom: 12
  			},
  			{
  				id: "21218",
  				label: "本巣市",
  				maxZoom: 12
  			},
  			{
  				id: "21219",
  				label: "郡上市",
  				maxZoom: 12
  			},
  			{
  				id: "21220",
  				label: "下呂市",
  				maxZoom: 12
  			},
  			{
  				id: "21221",
  				label: "海津市",
  				maxZoom: 12
  			},
  			{
  				id: "21302",
  				label: "岐南町",
  				maxZoom: 12
  			},
  			{
  				id: "21303",
  				label: "笠松町",
  				maxZoom: 12
  			},
  			{
  				id: "21341",
  				label: "養老町",
  				maxZoom: 12
  			},
  			{
  				id: "21361",
  				label: "垂井町",
  				maxZoom: 12
  			},
  			{
  				id: "21362",
  				label: "関ケ原町",
  				maxZoom: 12
  			},
  			{
  				id: "21381",
  				label: "神戸町",
  				maxZoom: 12
  			},
  			{
  				id: "21382",
  				label: "輪之内町",
  				maxZoom: 12
  			},
  			{
  				id: "21383",
  				label: "安八町",
  				maxZoom: 12
  			},
  			{
  				id: "21401",
  				label: "揖斐川町",
  				maxZoom: 12
  			},
  			{
  				id: "21403",
  				label: "大野町",
  				maxZoom: 12
  			},
  			{
  				id: "21404",
  				label: "池田町",
  				maxZoom: 12
  			},
  			{
  				id: "21421",
  				label: "北方町",
  				maxZoom: 12
  			},
  			{
  				id: "21501",
  				label: "坂祝町",
  				maxZoom: 12
  			},
  			{
  				id: "21502",
  				label: "富加町",
  				maxZoom: 12
  			},
  			{
  				id: "21503",
  				label: "川辺町",
  				maxZoom: 12
  			},
  			{
  				id: "21504",
  				label: "七宗町",
  				maxZoom: 12
  			},
  			{
  				id: "21505",
  				label: "八百津町",
  				maxZoom: 12
  			},
  			{
  				id: "21506",
  				label: "白川町",
  				maxZoom: 12
  			},
  			{
  				id: "21507",
  				label: "東白川村",
  				maxZoom: 12
  			},
  			{
  				id: "21521",
  				label: "御嵩町",
  				maxZoom: 12
  			},
  			{
  				id: "21604",
  				label: "白川村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "22000",
  		label: "静岡県",
  		children: [
  			{
  				id: "22100",
  				label: "静岡市",
  				children: [
  					{
  						id: "22101",
  						label: "葵区",
  						maxZoom: 12
  					},
  					{
  						id: "22102",
  						label: "駿河区",
  						maxZoom: 12
  					},
  					{
  						id: "22103",
  						label: "清水区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "22130",
  				label: "浜松市",
  				children: [
  					{
  						id: "22131",
  						label: "中区",
  						maxZoom: 12
  					},
  					{
  						id: "22132",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "22133",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "22134",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "22135",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "22136",
  						label: "浜北区",
  						maxZoom: 12
  					},
  					{
  						id: "22137",
  						label: "天竜区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "22203",
  				label: "沼津市",
  				maxZoom: 12
  			},
  			{
  				id: "22205",
  				label: "熱海市",
  				maxZoom: 12
  			},
  			{
  				id: "22206",
  				label: "三島市",
  				maxZoom: 12
  			},
  			{
  				id: "22207",
  				label: "富士宮市",
  				maxZoom: 12
  			},
  			{
  				id: "22208",
  				label: "伊東市",
  				maxZoom: 12
  			},
  			{
  				id: "22209",
  				label: "島田市",
  				maxZoom: 12
  			},
  			{
  				id: "22210",
  				label: "富士市",
  				maxZoom: 12
  			},
  			{
  				id: "22211",
  				label: "磐田市",
  				maxZoom: 12
  			},
  			{
  				id: "22212",
  				label: "焼津市",
  				maxZoom: 12
  			},
  			{
  				id: "22213",
  				label: "掛川市",
  				maxZoom: 12
  			},
  			{
  				id: "22214",
  				label: "藤枝市",
  				maxZoom: 12
  			},
  			{
  				id: "22215",
  				label: "御殿場市",
  				maxZoom: 12
  			},
  			{
  				id: "22216",
  				label: "袋井市",
  				maxZoom: 12
  			},
  			{
  				id: "22219",
  				label: "下田市",
  				maxZoom: 12
  			},
  			{
  				id: "22220",
  				label: "裾野市",
  				maxZoom: 12
  			},
  			{
  				id: "22221",
  				label: "湖西市",
  				maxZoom: 12
  			},
  			{
  				id: "22222",
  				label: "伊豆市",
  				maxZoom: 12
  			},
  			{
  				id: "22223",
  				label: "御前崎市",
  				maxZoom: 12
  			},
  			{
  				id: "22224",
  				label: "菊川市",
  				maxZoom: 12
  			},
  			{
  				id: "22225",
  				label: "伊豆の国市",
  				maxZoom: 12
  			},
  			{
  				id: "22226",
  				label: "牧之原市",
  				maxZoom: 12
  			},
  			{
  				id: "22301",
  				label: "東伊豆町",
  				maxZoom: 12
  			},
  			{
  				id: "22302",
  				label: "河津町",
  				maxZoom: 12
  			},
  			{
  				id: "22304",
  				label: "南伊豆町",
  				maxZoom: 12
  			},
  			{
  				id: "22305",
  				label: "松崎町",
  				maxZoom: 12
  			},
  			{
  				id: "22306",
  				label: "西伊豆町",
  				maxZoom: 12
  			},
  			{
  				id: "22325",
  				label: "函南町",
  				maxZoom: 12
  			},
  			{
  				id: "22341",
  				label: "清水町",
  				maxZoom: 12
  			},
  			{
  				id: "22342",
  				label: "長泉町",
  				maxZoom: 12
  			},
  			{
  				id: "22344",
  				label: "小山町",
  				maxZoom: 12
  			},
  			{
  				id: "22424",
  				label: "吉田町",
  				maxZoom: 12
  			},
  			{
  				id: "22429",
  				label: "川根本町",
  				maxZoom: 12
  			},
  			{
  				id: "22461",
  				label: "森町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "23000",
  		label: "愛知県",
  		children: [
  			{
  				id: "23100",
  				label: "名古屋市",
  				children: [
  					{
  						id: "23101",
  						label: "千種区",
  						maxZoom: 12
  					},
  					{
  						id: "23102",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "23103",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "23104",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "23105",
  						label: "中村区",
  						maxZoom: 12
  					},
  					{
  						id: "23106",
  						label: "中区",
  						maxZoom: 12
  					},
  					{
  						id: "23107",
  						label: "昭和区",
  						maxZoom: 12
  					},
  					{
  						id: "23108",
  						label: "瑞穂区",
  						maxZoom: 12
  					},
  					{
  						id: "23109",
  						label: "熱田区",
  						maxZoom: 12
  					},
  					{
  						id: "23110",
  						label: "中川区",
  						maxZoom: 12
  					},
  					{
  						id: "23111",
  						label: "港区",
  						maxZoom: 12
  					},
  					{
  						id: "23112",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "23113",
  						label: "守山区",
  						maxZoom: 12
  					},
  					{
  						id: "23114",
  						label: "緑区",
  						maxZoom: 12
  					},
  					{
  						id: "23115",
  						label: "名東区",
  						maxZoom: 12
  					},
  					{
  						id: "23116",
  						label: "天白区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "23201",
  				label: "豊橋市",
  				maxZoom: 12
  			},
  			{
  				id: "23202",
  				label: "岡崎市",
  				maxZoom: 12
  			},
  			{
  				id: "23203",
  				label: "一宮市",
  				maxZoom: 12
  			},
  			{
  				id: "23204",
  				label: "瀬戸市",
  				maxZoom: 12
  			},
  			{
  				id: "23205",
  				label: "半田市",
  				maxZoom: 12
  			},
  			{
  				id: "23206",
  				label: "春日井市",
  				maxZoom: 12
  			},
  			{
  				id: "23207",
  				label: "豊川市",
  				maxZoom: 12
  			},
  			{
  				id: "23208",
  				label: "津島市",
  				maxZoom: 12
  			},
  			{
  				id: "23209",
  				label: "碧南市",
  				maxZoom: 12
  			},
  			{
  				id: "23210",
  				label: "刈谷市",
  				maxZoom: 12
  			},
  			{
  				id: "23211",
  				label: "豊田市",
  				maxZoom: 12
  			},
  			{
  				id: "23212",
  				label: "安城市",
  				maxZoom: 12
  			},
  			{
  				id: "23213",
  				label: "西尾市",
  				maxZoom: 12
  			},
  			{
  				id: "23214",
  				label: "蒲郡市",
  				maxZoom: 12
  			},
  			{
  				id: "23215",
  				label: "犬山市",
  				maxZoom: 12
  			},
  			{
  				id: "23216",
  				label: "常滑市",
  				maxZoom: 12
  			},
  			{
  				id: "23217",
  				label: "江南市",
  				maxZoom: 12
  			},
  			{
  				id: "23219",
  				label: "小牧市",
  				maxZoom: 12
  			},
  			{
  				id: "23220",
  				label: "稲沢市",
  				maxZoom: 12
  			},
  			{
  				id: "23221",
  				label: "新城市",
  				maxZoom: 12
  			},
  			{
  				id: "23222",
  				label: "東海市",
  				maxZoom: 12
  			},
  			{
  				id: "23223",
  				label: "大府市",
  				maxZoom: 12
  			},
  			{
  				id: "23224",
  				label: "知多市",
  				maxZoom: 12
  			},
  			{
  				id: "23225",
  				label: "知立市",
  				maxZoom: 12
  			},
  			{
  				id: "23226",
  				label: "尾張旭市",
  				maxZoom: 12
  			},
  			{
  				id: "23227",
  				label: "高浜市",
  				maxZoom: 12
  			},
  			{
  				id: "23228",
  				label: "岩倉市",
  				maxZoom: 12
  			},
  			{
  				id: "23229",
  				label: "豊明市",
  				maxZoom: 12
  			},
  			{
  				id: "23230",
  				label: "日進市",
  				maxZoom: 12
  			},
  			{
  				id: "23231",
  				label: "田原市",
  				maxZoom: 12
  			},
  			{
  				id: "23232",
  				label: "愛西市",
  				maxZoom: 12
  			},
  			{
  				id: "23233",
  				label: "清須市",
  				maxZoom: 12
  			},
  			{
  				id: "23234",
  				label: "北名古屋市",
  				maxZoom: 12
  			},
  			{
  				id: "23235",
  				label: "弥富市",
  				maxZoom: 12
  			},
  			{
  				id: "23236",
  				label: "みよし市",
  				maxZoom: 12
  			},
  			{
  				id: "23237",
  				label: "あま市",
  				maxZoom: 12
  			},
  			{
  				id: "23238",
  				label: "長久手市",
  				maxZoom: 12
  			},
  			{
  				id: "23302",
  				label: "東郷町",
  				maxZoom: 12
  			},
  			{
  				id: "23342",
  				label: "豊山町",
  				maxZoom: 12
  			},
  			{
  				id: "23361",
  				label: "大口町",
  				maxZoom: 12
  			},
  			{
  				id: "23362",
  				label: "扶桑町",
  				maxZoom: 12
  			},
  			{
  				id: "23424",
  				label: "大治町",
  				maxZoom: 12
  			},
  			{
  				id: "23425",
  				label: "蟹江町",
  				maxZoom: 12
  			},
  			{
  				id: "23427",
  				label: "飛島村",
  				maxZoom: 12
  			},
  			{
  				id: "23441",
  				label: "阿久比町",
  				maxZoom: 12
  			},
  			{
  				id: "23442",
  				label: "東浦町",
  				maxZoom: 12
  			},
  			{
  				id: "23445",
  				label: "南知多町",
  				maxZoom: 12
  			},
  			{
  				id: "23446",
  				label: "美浜町",
  				maxZoom: 12
  			},
  			{
  				id: "23447",
  				label: "武豊町",
  				maxZoom: 12
  			},
  			{
  				id: "23501",
  				label: "幸田町",
  				maxZoom: 12
  			},
  			{
  				id: "23561",
  				label: "設楽町",
  				maxZoom: 12
  			},
  			{
  				id: "23562",
  				label: "東栄町",
  				maxZoom: 12
  			},
  			{
  				id: "23563",
  				label: "豊根村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "24000",
  		label: "三重県",
  		children: [
  			{
  				id: "24201",
  				label: "津市",
  				maxZoom: 12
  			},
  			{
  				id: "24202",
  				label: "四日市市",
  				maxZoom: 12
  			},
  			{
  				id: "24203",
  				label: "伊勢市",
  				maxZoom: 12
  			},
  			{
  				id: "24204",
  				label: "松阪市",
  				maxZoom: 12
  			},
  			{
  				id: "24205",
  				label: "桑名市",
  				maxZoom: 12
  			},
  			{
  				id: "24207",
  				label: "鈴鹿市",
  				maxZoom: 12
  			},
  			{
  				id: "24208",
  				label: "名張市",
  				maxZoom: 12
  			},
  			{
  				id: "24209",
  				label: "尾鷲市",
  				maxZoom: 12
  			},
  			{
  				id: "24210",
  				label: "亀山市",
  				maxZoom: 12
  			},
  			{
  				id: "24211",
  				label: "鳥羽市",
  				maxZoom: 12
  			},
  			{
  				id: "24212",
  				label: "熊野市",
  				maxZoom: 12
  			},
  			{
  				id: "24214",
  				label: "いなべ市",
  				maxZoom: 12
  			},
  			{
  				id: "24215",
  				label: "志摩市",
  				maxZoom: 12
  			},
  			{
  				id: "24216",
  				label: "伊賀市",
  				maxZoom: 12
  			},
  			{
  				id: "24303",
  				label: "木曽岬町",
  				maxZoom: 12
  			},
  			{
  				id: "24324",
  				label: "東員町",
  				maxZoom: 12
  			},
  			{
  				id: "24341",
  				label: "菰野町",
  				maxZoom: 12
  			},
  			{
  				id: "24343",
  				label: "朝日町",
  				maxZoom: 12
  			},
  			{
  				id: "24344",
  				label: "川越町",
  				maxZoom: 12
  			},
  			{
  				id: "24441",
  				label: "多気町",
  				maxZoom: 12
  			},
  			{
  				id: "24442",
  				label: "明和町",
  				maxZoom: 12
  			},
  			{
  				id: "24443",
  				label: "大台町",
  				maxZoom: 12
  			},
  			{
  				id: "24461",
  				label: "玉城町",
  				maxZoom: 12
  			},
  			{
  				id: "24470",
  				label: "度会町",
  				maxZoom: 12
  			},
  			{
  				id: "24471",
  				label: "大紀町",
  				maxZoom: 12
  			},
  			{
  				id: "24472",
  				label: "南伊勢町",
  				maxZoom: 12
  			},
  			{
  				id: "24543",
  				label: "紀北町",
  				maxZoom: 12
  			},
  			{
  				id: "24561",
  				label: "御浜町",
  				maxZoom: 12
  			},
  			{
  				id: "24562",
  				label: "紀宝町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "25000",
  		label: "滋賀県",
  		children: [
  			{
  				id: "25201",
  				label: "大津市",
  				maxZoom: 12
  			},
  			{
  				id: "25202",
  				label: "彦根市",
  				maxZoom: 12
  			},
  			{
  				id: "25203",
  				label: "長浜市",
  				maxZoom: 12
  			},
  			{
  				id: "25204",
  				label: "近江八幡市",
  				maxZoom: 12
  			},
  			{
  				id: "25206",
  				label: "草津市",
  				maxZoom: 12
  			},
  			{
  				id: "25207",
  				label: "守山市",
  				maxZoom: 12
  			},
  			{
  				id: "25208",
  				label: "栗東市",
  				maxZoom: 12
  			},
  			{
  				id: "25209",
  				label: "甲賀市",
  				maxZoom: 12
  			},
  			{
  				id: "25210",
  				label: "野洲市",
  				maxZoom: 12
  			},
  			{
  				id: "25211",
  				label: "湖南市",
  				maxZoom: 12
  			},
  			{
  				id: "25212",
  				label: "高島市",
  				maxZoom: 12
  			},
  			{
  				id: "25213",
  				label: "東近江市",
  				maxZoom: 12
  			},
  			{
  				id: "25214",
  				label: "米原市",
  				maxZoom: 12
  			},
  			{
  				id: "25383",
  				label: "日野町",
  				maxZoom: 12
  			},
  			{
  				id: "25384",
  				label: "竜王町",
  				maxZoom: 12
  			},
  			{
  				id: "25425",
  				label: "愛荘町",
  				maxZoom: 12
  			},
  			{
  				id: "25441",
  				label: "豊郷町",
  				maxZoom: 12
  			},
  			{
  				id: "25442",
  				label: "甲良町",
  				maxZoom: 12
  			},
  			{
  				id: "25443",
  				label: "多賀町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "26000",
  		label: "京都府",
  		children: [
  			{
  				id: "26100",
  				label: "京都市",
  				children: [
  					{
  						id: "26101",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "26102",
  						label: "上京区",
  						maxZoom: 12
  					},
  					{
  						id: "26103",
  						label: "左京区",
  						maxZoom: 12
  					},
  					{
  						id: "26104",
  						label: "中京区",
  						maxZoom: 12
  					},
  					{
  						id: "26105",
  						label: "東山区",
  						maxZoom: 12
  					},
  					{
  						id: "26106",
  						label: "下京区",
  						maxZoom: 12
  					},
  					{
  						id: "26107",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "26108",
  						label: "右京区",
  						maxZoom: 12
  					},
  					{
  						id: "26109",
  						label: "伏見区",
  						maxZoom: 12
  					},
  					{
  						id: "26110",
  						label: "山科区",
  						maxZoom: 12
  					},
  					{
  						id: "26111",
  						label: "西京区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "26201",
  				label: "福知山市",
  				maxZoom: 12
  			},
  			{
  				id: "26202",
  				label: "舞鶴市",
  				maxZoom: 12
  			},
  			{
  				id: "26203",
  				label: "綾部市",
  				maxZoom: 12
  			},
  			{
  				id: "26204",
  				label: "宇治市",
  				maxZoom: 12
  			},
  			{
  				id: "26205",
  				label: "宮津市",
  				maxZoom: 12
  			},
  			{
  				id: "26206",
  				label: "亀岡市",
  				maxZoom: 12
  			},
  			{
  				id: "26207",
  				label: "城陽市",
  				maxZoom: 12
  			},
  			{
  				id: "26208",
  				label: "向日市",
  				maxZoom: 12
  			},
  			{
  				id: "26209",
  				label: "長岡京市",
  				maxZoom: 12
  			},
  			{
  				id: "26210",
  				label: "八幡市",
  				maxZoom: 12
  			},
  			{
  				id: "26211",
  				label: "京田辺市",
  				maxZoom: 12
  			},
  			{
  				id: "26212",
  				label: "京丹後市",
  				maxZoom: 12
  			},
  			{
  				id: "26213",
  				label: "南丹市",
  				maxZoom: 12
  			},
  			{
  				id: "26214",
  				label: "木津川市",
  				maxZoom: 12
  			},
  			{
  				id: "26303",
  				label: "大山崎町",
  				maxZoom: 12
  			},
  			{
  				id: "26322",
  				label: "久御山町",
  				maxZoom: 12
  			},
  			{
  				id: "26343",
  				label: "井手町",
  				maxZoom: 12
  			},
  			{
  				id: "26344",
  				label: "宇治田原町",
  				maxZoom: 12
  			},
  			{
  				id: "26364",
  				label: "笠置町",
  				maxZoom: 12
  			},
  			{
  				id: "26365",
  				label: "和束町",
  				maxZoom: 12
  			},
  			{
  				id: "26366",
  				label: "精華町",
  				maxZoom: 12
  			},
  			{
  				id: "26367",
  				label: "南山城村",
  				maxZoom: 12
  			},
  			{
  				id: "26407",
  				label: "京丹波町",
  				maxZoom: 12
  			},
  			{
  				id: "26463",
  				label: "伊根町",
  				maxZoom: 12
  			},
  			{
  				id: "26465",
  				label: "与謝野町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "27000",
  		label: "大阪府",
  		children: [
  			{
  				id: "27100",
  				label: "大阪市",
  				children: [
  					{
  						id: "27102",
  						label: "都島区",
  						maxZoom: 12
  					},
  					{
  						id: "27103",
  						label: "福島区",
  						maxZoom: 12
  					},
  					{
  						id: "27104",
  						label: "此花区",
  						maxZoom: 12
  					},
  					{
  						id: "27106",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "27107",
  						label: "港区",
  						maxZoom: 12
  					},
  					{
  						id: "27108",
  						label: "大正区",
  						maxZoom: 12
  					},
  					{
  						id: "27109",
  						label: "天王寺区",
  						maxZoom: 12
  					},
  					{
  						id: "27111",
  						label: "浪速区",
  						maxZoom: 12
  					},
  					{
  						id: "27113",
  						label: "西淀川区",
  						maxZoom: 12
  					},
  					{
  						id: "27114",
  						label: "東淀川区",
  						maxZoom: 12
  					},
  					{
  						id: "27115",
  						label: "東成区",
  						maxZoom: 12
  					},
  					{
  						id: "27116",
  						label: "生野区",
  						maxZoom: 12
  					},
  					{
  						id: "27117",
  						label: "旭区",
  						maxZoom: 12
  					},
  					{
  						id: "27118",
  						label: "城東区",
  						maxZoom: 12
  					},
  					{
  						id: "27119",
  						label: "阿倍野区",
  						maxZoom: 12
  					},
  					{
  						id: "27120",
  						label: "住吉区",
  						maxZoom: 12
  					},
  					{
  						id: "27121",
  						label: "東住吉区",
  						maxZoom: 12
  					},
  					{
  						id: "27122",
  						label: "西成区",
  						maxZoom: 12
  					},
  					{
  						id: "27123",
  						label: "淀川区",
  						maxZoom: 12
  					},
  					{
  						id: "27124",
  						label: "鶴見区",
  						maxZoom: 12
  					},
  					{
  						id: "27125",
  						label: "住之江区",
  						maxZoom: 12
  					},
  					{
  						id: "27126",
  						label: "平野区",
  						maxZoom: 12
  					},
  					{
  						id: "27127",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "27128",
  						label: "中央区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "27140",
  				label: "堺市",
  				children: [
  					{
  						id: "27141",
  						label: "堺区",
  						maxZoom: 12
  					},
  					{
  						id: "27142",
  						label: "中区",
  						maxZoom: 12
  					},
  					{
  						id: "27143",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "27144",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "27145",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "27146",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "27147",
  						label: "美原区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "27202",
  				label: "岸和田市",
  				maxZoom: 12
  			},
  			{
  				id: "27203",
  				label: "豊中市",
  				maxZoom: 12
  			},
  			{
  				id: "27204",
  				label: "池田市",
  				maxZoom: 12
  			},
  			{
  				id: "27205",
  				label: "吹田市",
  				maxZoom: 12
  			},
  			{
  				id: "27206",
  				label: "泉大津市",
  				maxZoom: 12
  			},
  			{
  				id: "27207",
  				label: "高槻市",
  				maxZoom: 12
  			},
  			{
  				id: "27208",
  				label: "貝塚市",
  				maxZoom: 12
  			},
  			{
  				id: "27209",
  				label: "守口市",
  				maxZoom: 12
  			},
  			{
  				id: "27210",
  				label: "枚方市",
  				maxZoom: 12
  			},
  			{
  				id: "27211",
  				label: "茨木市",
  				maxZoom: 12
  			},
  			{
  				id: "27212",
  				label: "八尾市",
  				maxZoom: 12
  			},
  			{
  				id: "27213",
  				label: "泉佐野市",
  				maxZoom: 12
  			},
  			{
  				id: "27214",
  				label: "富田林市",
  				maxZoom: 12
  			},
  			{
  				id: "27215",
  				label: "寝屋川市",
  				maxZoom: 12
  			},
  			{
  				id: "27216",
  				label: "河内長野市",
  				maxZoom: 12
  			},
  			{
  				id: "27217",
  				label: "松原市",
  				maxZoom: 12
  			},
  			{
  				id: "27218",
  				label: "大東市",
  				maxZoom: 12
  			},
  			{
  				id: "27219",
  				label: "和泉市",
  				maxZoom: 12
  			},
  			{
  				id: "27220",
  				label: "箕面市",
  				maxZoom: 12
  			},
  			{
  				id: "27221",
  				label: "柏原市",
  				maxZoom: 12
  			},
  			{
  				id: "27222",
  				label: "羽曳野市",
  				maxZoom: 12
  			},
  			{
  				id: "27223",
  				label: "門真市",
  				maxZoom: 12
  			},
  			{
  				id: "27224",
  				label: "摂津市",
  				maxZoom: 12
  			},
  			{
  				id: "27225",
  				label: "高石市",
  				maxZoom: 12
  			},
  			{
  				id: "27226",
  				label: "藤井寺市",
  				maxZoom: 12
  			},
  			{
  				id: "27227",
  				label: "東大阪市",
  				maxZoom: 12
  			},
  			{
  				id: "27228",
  				label: "泉南市",
  				maxZoom: 12
  			},
  			{
  				id: "27229",
  				label: "四條畷市",
  				maxZoom: 12
  			},
  			{
  				id: "27230",
  				label: "交野市",
  				maxZoom: 12
  			},
  			{
  				id: "27231",
  				label: "大阪狭山市",
  				maxZoom: 12
  			},
  			{
  				id: "27232",
  				label: "阪南市",
  				maxZoom: 12
  			},
  			{
  				id: "27301",
  				label: "島本町",
  				maxZoom: 12
  			},
  			{
  				id: "27321",
  				label: "豊能町",
  				maxZoom: 12
  			},
  			{
  				id: "27322",
  				label: "能勢町",
  				maxZoom: 12
  			},
  			{
  				id: "27341",
  				label: "忠岡町",
  				maxZoom: 12
  			},
  			{
  				id: "27361",
  				label: "熊取町",
  				maxZoom: 12
  			},
  			{
  				id: "27362",
  				label: "田尻町",
  				maxZoom: 12
  			},
  			{
  				id: "27366",
  				label: "岬町",
  				maxZoom: 12
  			},
  			{
  				id: "27381",
  				label: "太子町",
  				maxZoom: 12
  			},
  			{
  				id: "27382",
  				label: "河南町",
  				maxZoom: 12
  			},
  			{
  				id: "27383",
  				label: "千早赤阪村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "28000",
  		label: "兵庫県",
  		children: [
  			{
  				id: "28100",
  				label: "神戸市",
  				children: [
  					{
  						id: "28101",
  						label: "東灘区",
  						maxZoom: 12
  					},
  					{
  						id: "28102",
  						label: "灘区",
  						maxZoom: 12
  					},
  					{
  						id: "28105",
  						label: "兵庫区",
  						maxZoom: 12
  					},
  					{
  						id: "28106",
  						label: "長田区",
  						maxZoom: 12
  					},
  					{
  						id: "28107",
  						label: "須磨区",
  						maxZoom: 12
  					},
  					{
  						id: "28108",
  						label: "垂水区",
  						maxZoom: 12
  					},
  					{
  						id: "28109",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "28110",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "28111",
  						label: "西区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "28201",
  				label: "姫路市",
  				maxZoom: 12
  			},
  			{
  				id: "28202",
  				label: "尼崎市",
  				maxZoom: 12
  			},
  			{
  				id: "28203",
  				label: "明石市",
  				maxZoom: 12
  			},
  			{
  				id: "28204",
  				label: "西宮市",
  				maxZoom: 12
  			},
  			{
  				id: "28205",
  				label: "洲本市",
  				maxZoom: 12
  			},
  			{
  				id: "28206",
  				label: "芦屋市",
  				maxZoom: 12
  			},
  			{
  				id: "28207",
  				label: "伊丹市",
  				maxZoom: 12
  			},
  			{
  				id: "28208",
  				label: "相生市",
  				maxZoom: 12
  			},
  			{
  				id: "28209",
  				label: "豊岡市",
  				maxZoom: 12
  			},
  			{
  				id: "28210",
  				label: "加古川市",
  				maxZoom: 12
  			},
  			{
  				id: "28212",
  				label: "赤穂市",
  				maxZoom: 12
  			},
  			{
  				id: "28213",
  				label: "西脇市",
  				maxZoom: 12
  			},
  			{
  				id: "28214",
  				label: "宝塚市",
  				maxZoom: 12
  			},
  			{
  				id: "28215",
  				label: "三木市",
  				maxZoom: 12
  			},
  			{
  				id: "28216",
  				label: "高砂市",
  				maxZoom: 12
  			},
  			{
  				id: "28217",
  				label: "川西市",
  				maxZoom: 12
  			},
  			{
  				id: "28218",
  				label: "小野市",
  				maxZoom: 12
  			},
  			{
  				id: "28219",
  				label: "三田市",
  				maxZoom: 12
  			},
  			{
  				id: "28220",
  				label: "加西市",
  				maxZoom: 12
  			},
  			{
  				id: "28221",
  				label: "丹波篠山市",
  				maxZoom: 12
  			},
  			{
  				id: "28222",
  				label: "養父市",
  				maxZoom: 12
  			},
  			{
  				id: "28223",
  				label: "丹波市",
  				maxZoom: 12
  			},
  			{
  				id: "28224",
  				label: "南あわじ市",
  				maxZoom: 12
  			},
  			{
  				id: "28225",
  				label: "朝来市",
  				maxZoom: 12
  			},
  			{
  				id: "28226",
  				label: "淡路市",
  				maxZoom: 12
  			},
  			{
  				id: "28227",
  				label: "宍粟市",
  				maxZoom: 12
  			},
  			{
  				id: "28228",
  				label: "加東市",
  				maxZoom: 12
  			},
  			{
  				id: "28229",
  				label: "たつの市",
  				maxZoom: 12
  			},
  			{
  				id: "28301",
  				label: "猪名川町",
  				maxZoom: 12
  			},
  			{
  				id: "28365",
  				label: "多可町",
  				maxZoom: 12
  			},
  			{
  				id: "28381",
  				label: "稲美町",
  				maxZoom: 12
  			},
  			{
  				id: "28382",
  				label: "播磨町",
  				maxZoom: 12
  			},
  			{
  				id: "28442",
  				label: "市川町",
  				maxZoom: 12
  			},
  			{
  				id: "28443",
  				label: "福崎町",
  				maxZoom: 12
  			},
  			{
  				id: "28446",
  				label: "神河町",
  				maxZoom: 12
  			},
  			{
  				id: "28464",
  				label: "太子町",
  				maxZoom: 12
  			},
  			{
  				id: "28481",
  				label: "上郡町",
  				maxZoom: 12
  			},
  			{
  				id: "28501",
  				label: "佐用町",
  				maxZoom: 12
  			},
  			{
  				id: "28585",
  				label: "香美町",
  				maxZoom: 12
  			},
  			{
  				id: "28586",
  				label: "新温泉町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "29000",
  		label: "奈良県",
  		children: [
  			{
  				id: "29201",
  				label: "奈良市",
  				maxZoom: 12
  			},
  			{
  				id: "29202",
  				label: "大和高田市",
  				maxZoom: 12
  			},
  			{
  				id: "29203",
  				label: "大和郡山市",
  				maxZoom: 12
  			},
  			{
  				id: "29204",
  				label: "天理市",
  				maxZoom: 12
  			},
  			{
  				id: "29205",
  				label: "橿原市",
  				maxZoom: 12
  			},
  			{
  				id: "29206",
  				label: "桜井市",
  				maxZoom: 12
  			},
  			{
  				id: "29207",
  				label: "五條市",
  				maxZoom: 12
  			},
  			{
  				id: "29208",
  				label: "御所市",
  				maxZoom: 12
  			},
  			{
  				id: "29209",
  				label: "生駒市",
  				maxZoom: 12
  			},
  			{
  				id: "29210",
  				label: "香芝市",
  				maxZoom: 12
  			},
  			{
  				id: "29211",
  				label: "葛城市",
  				maxZoom: 12
  			},
  			{
  				id: "29212",
  				label: "宇陀市",
  				maxZoom: 12
  			},
  			{
  				id: "29322",
  				label: "山添村",
  				maxZoom: 12
  			},
  			{
  				id: "29342",
  				label: "平群町",
  				maxZoom: 12
  			},
  			{
  				id: "29343",
  				label: "三郷町",
  				maxZoom: 12
  			},
  			{
  				id: "29344",
  				label: "斑鳩町",
  				maxZoom: 12
  			},
  			{
  				id: "29345",
  				label: "安堵町",
  				maxZoom: 12
  			},
  			{
  				id: "29361",
  				label: "川西町",
  				maxZoom: 12
  			},
  			{
  				id: "29362",
  				label: "三宅町",
  				maxZoom: 12
  			},
  			{
  				id: "29363",
  				label: "田原本町",
  				maxZoom: 12
  			},
  			{
  				id: "29385",
  				label: "曽爾村",
  				maxZoom: 12
  			},
  			{
  				id: "29386",
  				label: "御杖村",
  				maxZoom: 12
  			},
  			{
  				id: "29401",
  				label: "高取町",
  				maxZoom: 12
  			},
  			{
  				id: "29402",
  				label: "明日香村",
  				maxZoom: 12
  			},
  			{
  				id: "29424",
  				label: "上牧町",
  				maxZoom: 12
  			},
  			{
  				id: "29425",
  				label: "王寺町",
  				maxZoom: 12
  			},
  			{
  				id: "29426",
  				label: "広陵町",
  				maxZoom: 12
  			},
  			{
  				id: "29427",
  				label: "河合町",
  				maxZoom: 12
  			},
  			{
  				id: "29441",
  				label: "吉野町",
  				maxZoom: 12
  			},
  			{
  				id: "29442",
  				label: "大淀町",
  				maxZoom: 12
  			},
  			{
  				id: "29443",
  				label: "下市町",
  				maxZoom: 12
  			},
  			{
  				id: "29444",
  				label: "黒滝村",
  				maxZoom: 12
  			},
  			{
  				id: "29446",
  				label: "天川村",
  				maxZoom: 12
  			},
  			{
  				id: "29447",
  				label: "野迫川村",
  				maxZoom: 12
  			},
  			{
  				id: "29449",
  				label: "十津川村",
  				maxZoom: 12
  			},
  			{
  				id: "29450",
  				label: "下北山村",
  				maxZoom: 12
  			},
  			{
  				id: "29451",
  				label: "上北山村",
  				maxZoom: 12
  			},
  			{
  				id: "29452",
  				label: "川上村",
  				maxZoom: 12
  			},
  			{
  				id: "29453",
  				label: "東吉野村",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "30000",
  		label: "和歌山県",
  		children: [
  			{
  				id: "30201",
  				label: "和歌山市",
  				maxZoom: 12
  			},
  			{
  				id: "30202",
  				label: "海南市",
  				maxZoom: 12
  			},
  			{
  				id: "30203",
  				label: "橋本市",
  				maxZoom: 12
  			},
  			{
  				id: "30204",
  				label: "有田市",
  				maxZoom: 12
  			},
  			{
  				id: "30205",
  				label: "御坊市",
  				maxZoom: 12
  			},
  			{
  				id: "30206",
  				label: "田辺市",
  				maxZoom: 12
  			},
  			{
  				id: "30207",
  				label: "新宮市",
  				maxZoom: 12
  			},
  			{
  				id: "30208",
  				label: "紀の川市",
  				maxZoom: 12
  			},
  			{
  				id: "30209",
  				label: "岩出市",
  				maxZoom: 12
  			},
  			{
  				id: "30304",
  				label: "紀美野町",
  				maxZoom: 12
  			},
  			{
  				id: "30341",
  				label: "かつらぎ町",
  				maxZoom: 12
  			},
  			{
  				id: "30343",
  				label: "九度山町",
  				maxZoom: 12
  			},
  			{
  				id: "30344",
  				label: "高野町",
  				maxZoom: 12
  			},
  			{
  				id: "30361",
  				label: "湯浅町",
  				maxZoom: 12
  			},
  			{
  				id: "30362",
  				label: "広川町",
  				maxZoom: 12
  			},
  			{
  				id: "30366",
  				label: "有田川町",
  				maxZoom: 12
  			},
  			{
  				id: "30381",
  				label: "美浜町",
  				maxZoom: 12
  			},
  			{
  				id: "30382",
  				label: "日高町",
  				maxZoom: 12
  			},
  			{
  				id: "30383",
  				label: "由良町",
  				maxZoom: 12
  			},
  			{
  				id: "30390",
  				label: "印南町",
  				maxZoom: 12
  			},
  			{
  				id: "30391",
  				label: "みなべ町",
  				maxZoom: 12
  			},
  			{
  				id: "30392",
  				label: "日高川町",
  				maxZoom: 12
  			},
  			{
  				id: "30401",
  				label: "白浜町",
  				maxZoom: 12
  			},
  			{
  				id: "30404",
  				label: "上富田町",
  				maxZoom: 12
  			},
  			{
  				id: "30406",
  				label: "すさみ町",
  				maxZoom: 12
  			},
  			{
  				id: "30421",
  				label: "那智勝浦町",
  				maxZoom: 12
  			},
  			{
  				id: "30422",
  				label: "太地町",
  				maxZoom: 12
  			},
  			{
  				id: "30424",
  				label: "古座川町",
  				maxZoom: 12
  			},
  			{
  				id: "30427",
  				label: "北山村",
  				maxZoom: 12
  			},
  			{
  				id: "30428",
  				label: "串本町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "31000",
  		label: "鳥取県",
  		children: [
  			{
  				id: "31201",
  				label: "鳥取市",
  				maxZoom: 12
  			},
  			{
  				id: "31202",
  				label: "米子市",
  				maxZoom: 12
  			},
  			{
  				id: "31203",
  				label: "倉吉市",
  				maxZoom: 12
  			},
  			{
  				id: "31204",
  				label: "境港市",
  				maxZoom: 12
  			},
  			{
  				id: "31302",
  				label: "岩美町",
  				maxZoom: 12
  			},
  			{
  				id: "31325",
  				label: "若桜町",
  				maxZoom: 12
  			},
  			{
  				id: "31328",
  				label: "智頭町",
  				maxZoom: 12
  			},
  			{
  				id: "31329",
  				label: "八頭町",
  				maxZoom: 12
  			},
  			{
  				id: "31364",
  				label: "三朝町",
  				maxZoom: 12
  			},
  			{
  				id: "31370",
  				label: "湯梨浜町",
  				maxZoom: 12
  			},
  			{
  				id: "31371",
  				label: "琴浦町",
  				maxZoom: 12
  			},
  			{
  				id: "31372",
  				label: "北栄町",
  				maxZoom: 12
  			},
  			{
  				id: "31384",
  				label: "日吉津村",
  				maxZoom: 12
  			},
  			{
  				id: "31386",
  				label: "大山町",
  				maxZoom: 12
  			},
  			{
  				id: "31389",
  				label: "南部町",
  				maxZoom: 12
  			},
  			{
  				id: "31390",
  				label: "伯耆町",
  				maxZoom: 12
  			},
  			{
  				id: "31401",
  				label: "日南町",
  				maxZoom: 12
  			},
  			{
  				id: "31402",
  				label: "日野町",
  				maxZoom: 12
  			},
  			{
  				id: "31403",
  				label: "江府町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "32000",
  		label: "島根県",
  		children: [
  			{
  				id: "32201",
  				label: "松江市",
  				maxZoom: 12
  			},
  			{
  				id: "32202",
  				label: "浜田市",
  				maxZoom: 12
  			},
  			{
  				id: "32203",
  				label: "出雲市",
  				maxZoom: 12
  			},
  			{
  				id: "32204",
  				label: "益田市",
  				maxZoom: 12
  			},
  			{
  				id: "32205",
  				label: "大田市",
  				maxZoom: 12
  			},
  			{
  				id: "32206",
  				label: "安来市",
  				maxZoom: 12
  			},
  			{
  				id: "32207",
  				label: "江津市",
  				maxZoom: 12
  			},
  			{
  				id: "32209",
  				label: "雲南市",
  				maxZoom: 12
  			},
  			{
  				id: "32343",
  				label: "奥出雲町",
  				maxZoom: 12
  			},
  			{
  				id: "32386",
  				label: "飯南町",
  				maxZoom: 12
  			},
  			{
  				id: "32441",
  				label: "川本町",
  				maxZoom: 12
  			},
  			{
  				id: "32448",
  				label: "美郷町",
  				maxZoom: 12
  			},
  			{
  				id: "32449",
  				label: "邑南町",
  				maxZoom: 12
  			},
  			{
  				id: "32501",
  				label: "津和野町",
  				maxZoom: 12
  			},
  			{
  				id: "32505",
  				label: "吉賀町",
  				maxZoom: 12
  			},
  			{
  				id: "32525",
  				label: "海士町",
  				maxZoom: 12
  			},
  			{
  				id: "32526",
  				label: "西ノ島町",
  				maxZoom: 12
  			},
  			{
  				id: "32527",
  				label: "知夫村",
  				maxZoom: 12
  			},
  			{
  				id: "32528",
  				label: "隠岐の島町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "33000",
  		label: "岡山県",
  		children: [
  			{
  				id: "33100",
  				label: "岡山市",
  				children: [
  					{
  						id: "33101",
  						label: "北区",
  						maxZoom: 12
  					},
  					{
  						id: "33102",
  						label: "中区",
  						maxZoom: 12
  					},
  					{
  						id: "33103",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "33104",
  						label: "南区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "33202",
  				label: "倉敷市",
  				maxZoom: 12
  			},
  			{
  				id: "33203",
  				label: "津山市",
  				maxZoom: 12
  			},
  			{
  				id: "33204",
  				label: "玉野市",
  				maxZoom: 12
  			},
  			{
  				id: "33205",
  				label: "笠岡市",
  				maxZoom: 12
  			},
  			{
  				id: "33207",
  				label: "井原市",
  				maxZoom: 12
  			},
  			{
  				id: "33208",
  				label: "総社市",
  				maxZoom: 12
  			},
  			{
  				id: "33209",
  				label: "高梁市",
  				maxZoom: 12
  			},
  			{
  				id: "33210",
  				label: "新見市",
  				maxZoom: 12
  			},
  			{
  				id: "33211",
  				label: "備前市",
  				maxZoom: 12
  			},
  			{
  				id: "33212",
  				label: "瀬戸内市",
  				maxZoom: 12
  			},
  			{
  				id: "33213",
  				label: "赤磐市",
  				maxZoom: 12
  			},
  			{
  				id: "33214",
  				label: "真庭市",
  				maxZoom: 12
  			},
  			{
  				id: "33215",
  				label: "美作市",
  				maxZoom: 12
  			},
  			{
  				id: "33216",
  				label: "浅口市",
  				maxZoom: 12
  			},
  			{
  				id: "33346",
  				label: "和気町",
  				maxZoom: 12
  			},
  			{
  				id: "33423",
  				label: "早島町",
  				maxZoom: 12
  			},
  			{
  				id: "33445",
  				label: "里庄町",
  				maxZoom: 12
  			},
  			{
  				id: "33461",
  				label: "矢掛町",
  				maxZoom: 12
  			},
  			{
  				id: "33586",
  				label: "新庄村",
  				maxZoom: 12
  			},
  			{
  				id: "33606",
  				label: "鏡野町",
  				maxZoom: 12
  			},
  			{
  				id: "33622",
  				label: "勝央町",
  				maxZoom: 12
  			},
  			{
  				id: "33623",
  				label: "奈義町",
  				maxZoom: 12
  			},
  			{
  				id: "33643",
  				label: "西粟倉村",
  				maxZoom: 12
  			},
  			{
  				id: "33663",
  				label: "久米南町",
  				maxZoom: 12
  			},
  			{
  				id: "33666",
  				label: "美咲町",
  				maxZoom: 12
  			},
  			{
  				id: "33681",
  				label: "吉備中央町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "34000",
  		label: "広島県",
  		children: [
  			{
  				id: "34100",
  				label: "広島市",
  				children: [
  					{
  						id: "34101",
  						label: "中区",
  						maxZoom: 12
  					},
  					{
  						id: "34102",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "34103",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "34104",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "34105",
  						label: "安佐南区",
  						maxZoom: 12
  					},
  					{
  						id: "34106",
  						label: "安佐北区",
  						maxZoom: 12
  					},
  					{
  						id: "34107",
  						label: "安芸区",
  						maxZoom: 12
  					},
  					{
  						id: "34108",
  						label: "佐伯区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "34202",
  				label: "呉市",
  				maxZoom: 12
  			},
  			{
  				id: "34203",
  				label: "竹原市",
  				maxZoom: 12
  			},
  			{
  				id: "34204",
  				label: "三原市",
  				maxZoom: 12
  			},
  			{
  				id: "34205",
  				label: "尾道市",
  				maxZoom: 12
  			},
  			{
  				id: "34207",
  				label: "福山市",
  				maxZoom: 12
  			},
  			{
  				id: "34208",
  				label: "府中市",
  				maxZoom: 12
  			},
  			{
  				id: "34209",
  				label: "三次市",
  				maxZoom: 12
  			},
  			{
  				id: "34210",
  				label: "庄原市",
  				maxZoom: 12
  			},
  			{
  				id: "34211",
  				label: "大竹市",
  				maxZoom: 12
  			},
  			{
  				id: "34212",
  				label: "東広島市",
  				maxZoom: 12
  			},
  			{
  				id: "34213",
  				label: "廿日市市",
  				maxZoom: 12
  			},
  			{
  				id: "34214",
  				label: "安芸高田市",
  				maxZoom: 12
  			},
  			{
  				id: "34215",
  				label: "江田島市",
  				maxZoom: 12
  			},
  			{
  				id: "34302",
  				label: "府中町",
  				maxZoom: 12
  			},
  			{
  				id: "34304",
  				label: "海田町",
  				maxZoom: 12
  			},
  			{
  				id: "34307",
  				label: "熊野町",
  				maxZoom: 12
  			},
  			{
  				id: "34309",
  				label: "坂町",
  				maxZoom: 12
  			},
  			{
  				id: "34368",
  				label: "安芸太田町",
  				maxZoom: 12
  			},
  			{
  				id: "34369",
  				label: "北広島町",
  				maxZoom: 12
  			},
  			{
  				id: "34431",
  				label: "大崎上島町",
  				maxZoom: 12
  			},
  			{
  				id: "34462",
  				label: "世羅町",
  				maxZoom: 12
  			},
  			{
  				id: "34545",
  				label: "神石高原町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "35000",
  		label: "山口県",
  		children: [
  			{
  				id: "35201",
  				label: "下関市",
  				maxZoom: 12
  			},
  			{
  				id: "35202",
  				label: "宇部市",
  				maxZoom: 12
  			},
  			{
  				id: "35203",
  				label: "山口市",
  				maxZoom: 12
  			},
  			{
  				id: "35204",
  				label: "萩市",
  				maxZoom: 12
  			},
  			{
  				id: "35206",
  				label: "防府市",
  				maxZoom: 12
  			},
  			{
  				id: "35207",
  				label: "下松市",
  				maxZoom: 12
  			},
  			{
  				id: "35208",
  				label: "岩国市",
  				maxZoom: 12
  			},
  			{
  				id: "35210",
  				label: "光市",
  				maxZoom: 12
  			},
  			{
  				id: "35211",
  				label: "長門市",
  				maxZoom: 12
  			},
  			{
  				id: "35212",
  				label: "柳井市",
  				maxZoom: 12
  			},
  			{
  				id: "35213",
  				label: "美祢市",
  				maxZoom: 12
  			},
  			{
  				id: "35215",
  				label: "周南市",
  				maxZoom: 12
  			},
  			{
  				id: "35216",
  				label: "山陽小野田市",
  				maxZoom: 12
  			},
  			{
  				id: "35305",
  				label: "周防大島町",
  				maxZoom: 12
  			},
  			{
  				id: "35321",
  				label: "和木町",
  				maxZoom: 12
  			},
  			{
  				id: "35341",
  				label: "上関町",
  				maxZoom: 12
  			},
  			{
  				id: "35343",
  				label: "田布施町",
  				maxZoom: 12
  			},
  			{
  				id: "35344",
  				label: "平生町",
  				maxZoom: 12
  			},
  			{
  				id: "35502",
  				label: "阿武町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "36000",
  		label: "徳島県",
  		children: [
  			{
  				id: "36201",
  				label: "徳島市",
  				maxZoom: 12
  			},
  			{
  				id: "36202",
  				label: "鳴門市",
  				maxZoom: 12
  			},
  			{
  				id: "36203",
  				label: "小松島市",
  				maxZoom: 12
  			},
  			{
  				id: "36204",
  				label: "阿南市",
  				maxZoom: 12
  			},
  			{
  				id: "36205",
  				label: "吉野川市",
  				maxZoom: 12
  			},
  			{
  				id: "36206",
  				label: "阿波市",
  				maxZoom: 12
  			},
  			{
  				id: "36207",
  				label: "美馬市",
  				maxZoom: 12
  			},
  			{
  				id: "36208",
  				label: "三好市",
  				maxZoom: 12
  			},
  			{
  				id: "36301",
  				label: "勝浦町",
  				maxZoom: 12
  			},
  			{
  				id: "36302",
  				label: "上勝町",
  				maxZoom: 12
  			},
  			{
  				id: "36321",
  				label: "佐那河内村",
  				maxZoom: 12
  			},
  			{
  				id: "36341",
  				label: "石井町",
  				maxZoom: 12
  			},
  			{
  				id: "36342",
  				label: "神山町",
  				maxZoom: 12
  			},
  			{
  				id: "36368",
  				label: "那賀町",
  				maxZoom: 12
  			},
  			{
  				id: "36383",
  				label: "牟岐町",
  				maxZoom: 12
  			},
  			{
  				id: "36387",
  				label: "美波町",
  				maxZoom: 12
  			},
  			{
  				id: "36388",
  				label: "海陽町",
  				maxZoom: 12
  			},
  			{
  				id: "36401",
  				label: "松茂町",
  				maxZoom: 12
  			},
  			{
  				id: "36402",
  				label: "北島町",
  				maxZoom: 12
  			},
  			{
  				id: "36403",
  				label: "藍住町",
  				maxZoom: 12
  			},
  			{
  				id: "36404",
  				label: "板野町",
  				maxZoom: 12
  			},
  			{
  				id: "36405",
  				label: "上板町",
  				maxZoom: 12
  			},
  			{
  				id: "36468",
  				label: "つるぎ町",
  				maxZoom: 12
  			},
  			{
  				id: "36489",
  				label: "東みよし町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "37000",
  		label: "香川県",
  		children: [
  			{
  				id: "37201",
  				label: "高松市",
  				maxZoom: 12
  			},
  			{
  				id: "37202",
  				label: "丸亀市",
  				maxZoom: 12
  			},
  			{
  				id: "37203",
  				label: "坂出市",
  				maxZoom: 12
  			},
  			{
  				id: "37204",
  				label: "善通寺市",
  				maxZoom: 12
  			},
  			{
  				id: "37205",
  				label: "観音寺市",
  				maxZoom: 12
  			},
  			{
  				id: "37206",
  				label: "さぬき市",
  				maxZoom: 12
  			},
  			{
  				id: "37207",
  				label: "東かがわ市",
  				maxZoom: 12
  			},
  			{
  				id: "37208",
  				label: "三豊市",
  				maxZoom: 12
  			},
  			{
  				id: "37322",
  				label: "土庄町",
  				maxZoom: 12
  			},
  			{
  				id: "37324",
  				label: "小豆島町",
  				maxZoom: 12
  			},
  			{
  				id: "37341",
  				label: "三木町",
  				maxZoom: 12
  			},
  			{
  				id: "37364",
  				label: "直島町",
  				maxZoom: 12
  			},
  			{
  				id: "37386",
  				label: "宇多津町",
  				maxZoom: 12
  			},
  			{
  				id: "37387",
  				label: "綾川町",
  				maxZoom: 12
  			},
  			{
  				id: "37403",
  				label: "琴平町",
  				maxZoom: 12
  			},
  			{
  				id: "37404",
  				label: "多度津町",
  				maxZoom: 12
  			},
  			{
  				id: "37406",
  				label: "まんのう町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "38000",
  		label: "愛媛県",
  		children: [
  			{
  				id: "38201",
  				label: "松山市",
  				maxZoom: 12
  			},
  			{
  				id: "38202",
  				label: "今治市",
  				maxZoom: 12
  			},
  			{
  				id: "38203",
  				label: "宇和島市",
  				maxZoom: 12
  			},
  			{
  				id: "38204",
  				label: "八幡浜市",
  				maxZoom: 12
  			},
  			{
  				id: "38205",
  				label: "新居浜市",
  				maxZoom: 12
  			},
  			{
  				id: "38206",
  				label: "西条市",
  				maxZoom: 12
  			},
  			{
  				id: "38207",
  				label: "大洲市",
  				maxZoom: 12
  			},
  			{
  				id: "38210",
  				label: "伊予市",
  				maxZoom: 12
  			},
  			{
  				id: "38213",
  				label: "四国中央市",
  				maxZoom: 12
  			},
  			{
  				id: "38214",
  				label: "西予市",
  				maxZoom: 12
  			},
  			{
  				id: "38215",
  				label: "東温市",
  				maxZoom: 12
  			},
  			{
  				id: "38356",
  				label: "上島町",
  				maxZoom: 12
  			},
  			{
  				id: "38386",
  				label: "久万高原町",
  				maxZoom: 12
  			},
  			{
  				id: "38401",
  				label: "松前町",
  				maxZoom: 12
  			},
  			{
  				id: "38402",
  				label: "砥部町",
  				maxZoom: 12
  			},
  			{
  				id: "38422",
  				label: "内子町",
  				maxZoom: 12
  			},
  			{
  				id: "38442",
  				label: "伊方町",
  				maxZoom: 12
  			},
  			{
  				id: "38484",
  				label: "松野町",
  				maxZoom: 12
  			},
  			{
  				id: "38488",
  				label: "鬼北町",
  				maxZoom: 12
  			},
  			{
  				id: "38506",
  				label: "愛南町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "39000",
  		label: "高知県",
  		children: [
  			{
  				id: "39201",
  				label: "高知市",
  				maxZoom: 12
  			},
  			{
  				id: "39202",
  				label: "室戸市",
  				maxZoom: 12
  			},
  			{
  				id: "39203",
  				label: "安芸市",
  				maxZoom: 12
  			},
  			{
  				id: "39204",
  				label: "南国市",
  				maxZoom: 12
  			},
  			{
  				id: "39205",
  				label: "土佐市",
  				maxZoom: 12
  			},
  			{
  				id: "39206",
  				label: "須崎市",
  				maxZoom: 12
  			},
  			{
  				id: "39208",
  				label: "宿毛市",
  				maxZoom: 12
  			},
  			{
  				id: "39209",
  				label: "土佐清水市",
  				maxZoom: 12
  			},
  			{
  				id: "39210",
  				label: "四万十市",
  				maxZoom: 12
  			},
  			{
  				id: "39211",
  				label: "香南市",
  				maxZoom: 12
  			},
  			{
  				id: "39212",
  				label: "香美市",
  				maxZoom: 12
  			},
  			{
  				id: "39301",
  				label: "東洋町",
  				maxZoom: 12
  			},
  			{
  				id: "39302",
  				label: "奈半利町",
  				maxZoom: 12
  			},
  			{
  				id: "39303",
  				label: "田野町",
  				maxZoom: 12
  			},
  			{
  				id: "39304",
  				label: "安田町",
  				maxZoom: 12
  			},
  			{
  				id: "39305",
  				label: "北川村",
  				maxZoom: 12
  			},
  			{
  				id: "39306",
  				label: "馬路村",
  				maxZoom: 12
  			},
  			{
  				id: "39307",
  				label: "芸西村",
  				maxZoom: 12
  			},
  			{
  				id: "39341",
  				label: "本山町",
  				maxZoom: 12
  			},
  			{
  				id: "39344",
  				label: "大豊町",
  				maxZoom: 12
  			},
  			{
  				id: "39363",
  				label: "土佐町",
  				maxZoom: 12
  			},
  			{
  				id: "39364",
  				label: "大川村",
  				maxZoom: 12
  			},
  			{
  				id: "39386",
  				label: "いの町",
  				maxZoom: 12
  			},
  			{
  				id: "39387",
  				label: "仁淀川町",
  				maxZoom: 12
  			},
  			{
  				id: "39401",
  				label: "中土佐町",
  				maxZoom: 12
  			},
  			{
  				id: "39402",
  				label: "佐川町",
  				maxZoom: 12
  			},
  			{
  				id: "39403",
  				label: "越知町",
  				maxZoom: 12
  			},
  			{
  				id: "39405",
  				label: "檮原町",
  				maxZoom: 12
  			},
  			{
  				id: "39410",
  				label: "日高村",
  				maxZoom: 12
  			},
  			{
  				id: "39411",
  				label: "津野町",
  				maxZoom: 12
  			},
  			{
  				id: "39412",
  				label: "四万十町",
  				maxZoom: 12
  			},
  			{
  				id: "39424",
  				label: "大月町",
  				maxZoom: 12
  			},
  			{
  				id: "39427",
  				label: "三原村",
  				maxZoom: 12
  			},
  			{
  				id: "39428",
  				label: "黒潮町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "40000",
  		label: "福岡県",
  		children: [
  			{
  				id: "40100",
  				label: "北九州市",
  				children: [
  					{
  						id: "40101",
  						label: "門司区",
  						maxZoom: 12
  					},
  					{
  						id: "40103",
  						label: "若松区",
  						maxZoom: 12
  					},
  					{
  						id: "40105",
  						label: "戸畑区",
  						maxZoom: 12
  					},
  					{
  						id: "40106",
  						label: "小倉北区",
  						maxZoom: 12
  					},
  					{
  						id: "40107",
  						label: "小倉南区",
  						maxZoom: 12
  					},
  					{
  						id: "40108",
  						label: "八幡東区",
  						maxZoom: 12
  					},
  					{
  						id: "40109",
  						label: "八幡西区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "40130",
  				label: "福岡市",
  				children: [
  					{
  						id: "40131",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "40132",
  						label: "博多区",
  						maxZoom: 12
  					},
  					{
  						id: "40133",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "40134",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "40135",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "40136",
  						label: "城南区",
  						maxZoom: 12
  					},
  					{
  						id: "40137",
  						label: "早良区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "40202",
  				label: "大牟田市",
  				maxZoom: 12
  			},
  			{
  				id: "40203",
  				label: "久留米市",
  				maxZoom: 12
  			},
  			{
  				id: "40204",
  				label: "直方市",
  				maxZoom: 12
  			},
  			{
  				id: "40205",
  				label: "飯塚市",
  				maxZoom: 12
  			},
  			{
  				id: "40206",
  				label: "田川市",
  				maxZoom: 12
  			},
  			{
  				id: "40207",
  				label: "柳川市",
  				maxZoom: 12
  			},
  			{
  				id: "40210",
  				label: "八女市",
  				maxZoom: 12
  			},
  			{
  				id: "40211",
  				label: "筑後市",
  				maxZoom: 12
  			},
  			{
  				id: "40212",
  				label: "大川市",
  				maxZoom: 12
  			},
  			{
  				id: "40213",
  				label: "行橋市",
  				maxZoom: 12
  			},
  			{
  				id: "40214",
  				label: "豊前市",
  				maxZoom: 12
  			},
  			{
  				id: "40215",
  				label: "中間市",
  				maxZoom: 12
  			},
  			{
  				id: "40216",
  				label: "小郡市",
  				maxZoom: 12
  			},
  			{
  				id: "40217",
  				label: "筑紫野市",
  				maxZoom: 12
  			},
  			{
  				id: "40218",
  				label: "春日市",
  				maxZoom: 12
  			},
  			{
  				id: "40219",
  				label: "大野城市",
  				maxZoom: 12
  			},
  			{
  				id: "40220",
  				label: "宗像市",
  				maxZoom: 12
  			},
  			{
  				id: "40221",
  				label: "太宰府市",
  				maxZoom: 12
  			},
  			{
  				id: "40223",
  				label: "古賀市",
  				maxZoom: 12
  			},
  			{
  				id: "40224",
  				label: "福津市",
  				maxZoom: 12
  			},
  			{
  				id: "40225",
  				label: "うきは市",
  				maxZoom: 12
  			},
  			{
  				id: "40226",
  				label: "宮若市",
  				maxZoom: 12
  			},
  			{
  				id: "40227",
  				label: "嘉麻市",
  				maxZoom: 12
  			},
  			{
  				id: "40228",
  				label: "朝倉市",
  				maxZoom: 12
  			},
  			{
  				id: "40229",
  				label: "みやま市",
  				maxZoom: 12
  			},
  			{
  				id: "40230",
  				label: "糸島市",
  				maxZoom: 12
  			},
  			{
  				id: "40231",
  				label: "那珂川市",
  				maxZoom: 12
  			},
  			{
  				id: "40341",
  				label: "宇美町",
  				maxZoom: 12
  			},
  			{
  				id: "40342",
  				label: "篠栗町",
  				maxZoom: 12
  			},
  			{
  				id: "40343",
  				label: "志免町",
  				maxZoom: 12
  			},
  			{
  				id: "40344",
  				label: "須恵町",
  				maxZoom: 12
  			},
  			{
  				id: "40345",
  				label: "新宮町",
  				maxZoom: 12
  			},
  			{
  				id: "40348",
  				label: "久山町",
  				maxZoom: 12
  			},
  			{
  				id: "40349",
  				label: "粕屋町",
  				maxZoom: 12
  			},
  			{
  				id: "40381",
  				label: "芦屋町",
  				maxZoom: 12
  			},
  			{
  				id: "40382",
  				label: "水巻町",
  				maxZoom: 12
  			},
  			{
  				id: "40383",
  				label: "岡垣町",
  				maxZoom: 12
  			},
  			{
  				id: "40384",
  				label: "遠賀町",
  				maxZoom: 12
  			},
  			{
  				id: "40401",
  				label: "小竹町",
  				maxZoom: 12
  			},
  			{
  				id: "40402",
  				label: "鞍手町",
  				maxZoom: 12
  			},
  			{
  				id: "40421",
  				label: "桂川町",
  				maxZoom: 12
  			},
  			{
  				id: "40447",
  				label: "筑前町",
  				maxZoom: 12
  			},
  			{
  				id: "40448",
  				label: "東峰村",
  				maxZoom: 12
  			},
  			{
  				id: "40503",
  				label: "大刀洗町",
  				maxZoom: 12
  			},
  			{
  				id: "40522",
  				label: "大木町",
  				maxZoom: 12
  			},
  			{
  				id: "40544",
  				label: "広川町",
  				maxZoom: 12
  			},
  			{
  				id: "40601",
  				label: "香春町",
  				maxZoom: 12
  			},
  			{
  				id: "40602",
  				label: "添田町",
  				maxZoom: 12
  			},
  			{
  				id: "40604",
  				label: "糸田町",
  				maxZoom: 12
  			},
  			{
  				id: "40605",
  				label: "川崎町",
  				maxZoom: 12
  			},
  			{
  				id: "40608",
  				label: "大任町",
  				maxZoom: 12
  			},
  			{
  				id: "40609",
  				label: "赤村",
  				maxZoom: 12
  			},
  			{
  				id: "40610",
  				label: "福智町",
  				maxZoom: 12
  			},
  			{
  				id: "40621",
  				label: "苅田町",
  				maxZoom: 12
  			},
  			{
  				id: "40625",
  				label: "みやこ町",
  				maxZoom: 12
  			},
  			{
  				id: "40642",
  				label: "吉富町",
  				maxZoom: 12
  			},
  			{
  				id: "40646",
  				label: "上毛町",
  				maxZoom: 12
  			},
  			{
  				id: "40647",
  				label: "築上町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "41000",
  		label: "佐賀県",
  		children: [
  			{
  				id: "41201",
  				label: "佐賀市",
  				maxZoom: 12
  			},
  			{
  				id: "41202",
  				label: "唐津市",
  				maxZoom: 12
  			},
  			{
  				id: "41203",
  				label: "鳥栖市",
  				maxZoom: 12
  			},
  			{
  				id: "41204",
  				label: "多久市",
  				maxZoom: 12
  			},
  			{
  				id: "41205",
  				label: "伊万里市",
  				maxZoom: 12
  			},
  			{
  				id: "41206",
  				label: "武雄市",
  				maxZoom: 12
  			},
  			{
  				id: "41207",
  				label: "鹿島市",
  				maxZoom: 12
  			},
  			{
  				id: "41208",
  				label: "小城市",
  				maxZoom: 12
  			},
  			{
  				id: "41209",
  				label: "嬉野市",
  				maxZoom: 12
  			},
  			{
  				id: "41210",
  				label: "神埼市",
  				maxZoom: 12
  			},
  			{
  				id: "41327",
  				label: "吉野ヶ里町",
  				maxZoom: 12
  			},
  			{
  				id: "41341",
  				label: "基山町",
  				maxZoom: 12
  			},
  			{
  				id: "41345",
  				label: "上峰町",
  				maxZoom: 12
  			},
  			{
  				id: "41346",
  				label: "みやき町",
  				maxZoom: 12
  			},
  			{
  				id: "41387",
  				label: "玄海町",
  				maxZoom: 12
  			},
  			{
  				id: "41401",
  				label: "有田町",
  				maxZoom: 12
  			},
  			{
  				id: "41423",
  				label: "大町町",
  				maxZoom: 12
  			},
  			{
  				id: "41424",
  				label: "江北町",
  				maxZoom: 12
  			},
  			{
  				id: "41425",
  				label: "白石町",
  				maxZoom: 12
  			},
  			{
  				id: "41441",
  				label: "太良町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "42000",
  		label: "長崎県",
  		children: [
  			{
  				id: "42201",
  				label: "長崎市",
  				maxZoom: 12
  			},
  			{
  				id: "42202",
  				label: "佐世保市",
  				maxZoom: 12
  			},
  			{
  				id: "42203",
  				label: "島原市",
  				maxZoom: 12
  			},
  			{
  				id: "42204",
  				label: "諫早市",
  				maxZoom: 12
  			},
  			{
  				id: "42205",
  				label: "大村市",
  				maxZoom: 12
  			},
  			{
  				id: "42207",
  				label: "平戸市",
  				maxZoom: 12
  			},
  			{
  				id: "42208",
  				label: "松浦市",
  				maxZoom: 12
  			},
  			{
  				id: "42209",
  				label: "対馬市",
  				maxZoom: 12
  			},
  			{
  				id: "42210",
  				label: "壱岐市",
  				maxZoom: 12
  			},
  			{
  				id: "42211",
  				label: "五島市",
  				maxZoom: 12
  			},
  			{
  				id: "42212",
  				label: "西海市",
  				maxZoom: 12
  			},
  			{
  				id: "42213",
  				label: "雲仙市",
  				maxZoom: 12
  			},
  			{
  				id: "42214",
  				label: "南島原市",
  				maxZoom: 12
  			},
  			{
  				id: "42307",
  				label: "長与町",
  				maxZoom: 12
  			},
  			{
  				id: "42308",
  				label: "時津町",
  				maxZoom: 12
  			},
  			{
  				id: "42321",
  				label: "東彼杵町",
  				maxZoom: 12
  			},
  			{
  				id: "42322",
  				label: "川棚町",
  				maxZoom: 12
  			},
  			{
  				id: "42323",
  				label: "波佐見町",
  				maxZoom: 12
  			},
  			{
  				id: "42383",
  				label: "小値賀町",
  				maxZoom: 12
  			},
  			{
  				id: "42391",
  				label: "佐々町",
  				maxZoom: 12
  			},
  			{
  				id: "42411",
  				label: "新上五島町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "43000",
  		label: "熊本県",
  		children: [
  			{
  				id: "43100",
  				label: "熊本市",
  				children: [
  					{
  						id: "43101",
  						label: "中央区",
  						maxZoom: 12
  					},
  					{
  						id: "43102",
  						label: "東区",
  						maxZoom: 12
  					},
  					{
  						id: "43103",
  						label: "西区",
  						maxZoom: 12
  					},
  					{
  						id: "43104",
  						label: "南区",
  						maxZoom: 12
  					},
  					{
  						id: "43105",
  						label: "北区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "43202",
  				label: "八代市",
  				maxZoom: 12
  			},
  			{
  				id: "43203",
  				label: "人吉市",
  				maxZoom: 12
  			},
  			{
  				id: "43204",
  				label: "荒尾市",
  				maxZoom: 12
  			},
  			{
  				id: "43205",
  				label: "水俣市",
  				maxZoom: 12
  			},
  			{
  				id: "43206",
  				label: "玉名市",
  				maxZoom: 12
  			},
  			{
  				id: "43208",
  				label: "山鹿市",
  				maxZoom: 12
  			},
  			{
  				id: "43210",
  				label: "菊池市",
  				maxZoom: 12
  			},
  			{
  				id: "43211",
  				label: "宇土市",
  				maxZoom: 12
  			},
  			{
  				id: "43212",
  				label: "上天草市",
  				maxZoom: 12
  			},
  			{
  				id: "43213",
  				label: "宇城市",
  				maxZoom: 12
  			},
  			{
  				id: "43214",
  				label: "阿蘇市",
  				maxZoom: 12
  			},
  			{
  				id: "43215",
  				label: "天草市",
  				maxZoom: 12
  			},
  			{
  				id: "43216",
  				label: "合志市",
  				maxZoom: 12
  			},
  			{
  				id: "43348",
  				label: "美里町",
  				maxZoom: 12
  			},
  			{
  				id: "43364",
  				label: "玉東町",
  				maxZoom: 12
  			},
  			{
  				id: "43367",
  				label: "南関町",
  				maxZoom: 12
  			},
  			{
  				id: "43368",
  				label: "長洲町",
  				maxZoom: 12
  			},
  			{
  				id: "43369",
  				label: "和水町",
  				maxZoom: 12
  			},
  			{
  				id: "43403",
  				label: "大津町",
  				maxZoom: 12
  			},
  			{
  				id: "43404",
  				label: "菊陽町",
  				maxZoom: 12
  			},
  			{
  				id: "43423",
  				label: "南小国町",
  				maxZoom: 12
  			},
  			{
  				id: "43424",
  				label: "小国町",
  				maxZoom: 12
  			},
  			{
  				id: "43425",
  				label: "産山村",
  				maxZoom: 12
  			},
  			{
  				id: "43428",
  				label: "高森町",
  				maxZoom: 12
  			},
  			{
  				id: "43432",
  				label: "西原村",
  				maxZoom: 12
  			},
  			{
  				id: "43433",
  				label: "南阿蘇村",
  				maxZoom: 12
  			},
  			{
  				id: "43441",
  				label: "御船町",
  				maxZoom: 12
  			},
  			{
  				id: "43442",
  				label: "嘉島町",
  				maxZoom: 12
  			},
  			{
  				id: "43443",
  				label: "益城町",
  				maxZoom: 12
  			},
  			{
  				id: "43444",
  				label: "甲佐町",
  				maxZoom: 12
  			},
  			{
  				id: "43447",
  				label: "山都町",
  				maxZoom: 12
  			},
  			{
  				id: "43468",
  				label: "氷川町",
  				maxZoom: 12
  			},
  			{
  				id: "43482",
  				label: "芦北町",
  				maxZoom: 12
  			},
  			{
  				id: "43484",
  				label: "津奈木町",
  				maxZoom: 12
  			},
  			{
  				id: "43501",
  				label: "錦町",
  				maxZoom: 12
  			},
  			{
  				id: "43505",
  				label: "多良木町",
  				maxZoom: 12
  			},
  			{
  				id: "43506",
  				label: "湯前町",
  				maxZoom: 12
  			},
  			{
  				id: "43507",
  				label: "水上村",
  				maxZoom: 12
  			},
  			{
  				id: "43510",
  				label: "相良村",
  				maxZoom: 12
  			},
  			{
  				id: "43511",
  				label: "五木村",
  				maxZoom: 12
  			},
  			{
  				id: "43512",
  				label: "山江村",
  				maxZoom: 12
  			},
  			{
  				id: "43513",
  				label: "球磨村",
  				maxZoom: 12
  			},
  			{
  				id: "43514",
  				label: "あさぎり町",
  				maxZoom: 12
  			},
  			{
  				id: "43531",
  				label: "苓北町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "44000",
  		label: "大分県",
  		children: [
  			{
  				id: "44201",
  				label: "大分市",
  				maxZoom: 12
  			},
  			{
  				id: "44202",
  				label: "別府市",
  				maxZoom: 12
  			},
  			{
  				id: "44203",
  				label: "中津市",
  				maxZoom: 12
  			},
  			{
  				id: "44204",
  				label: "日田市",
  				maxZoom: 12
  			},
  			{
  				id: "44205",
  				label: "佐伯市",
  				maxZoom: 12
  			},
  			{
  				id: "44206",
  				label: "臼杵市",
  				maxZoom: 12
  			},
  			{
  				id: "44207",
  				label: "津久見市",
  				maxZoom: 12
  			},
  			{
  				id: "44208",
  				label: "竹田市",
  				maxZoom: 12
  			},
  			{
  				id: "44209",
  				label: "豊後高田市",
  				maxZoom: 12
  			},
  			{
  				id: "44210",
  				label: "杵築市",
  				maxZoom: 12
  			},
  			{
  				id: "44211",
  				label: "宇佐市",
  				maxZoom: 12
  			},
  			{
  				id: "44212",
  				label: "豊後大野市",
  				maxZoom: 12
  			},
  			{
  				id: "44213",
  				label: "由布市",
  				maxZoom: 12
  			},
  			{
  				id: "44214",
  				label: "国東市",
  				maxZoom: 12
  			},
  			{
  				id: "44322",
  				label: "姫島村",
  				maxZoom: 12
  			},
  			{
  				id: "44341",
  				label: "日出町",
  				maxZoom: 12
  			},
  			{
  				id: "44461",
  				label: "九重町",
  				maxZoom: 12
  			},
  			{
  				id: "44462",
  				label: "玖珠町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "45000",
  		label: "宮崎県",
  		children: [
  			{
  				id: "45201",
  				label: "宮崎市",
  				maxZoom: 12
  			},
  			{
  				id: "45202",
  				label: "都城市",
  				maxZoom: 12
  			},
  			{
  				id: "45203",
  				label: "延岡市",
  				maxZoom: 12
  			},
  			{
  				id: "45204",
  				label: "日南市",
  				maxZoom: 12
  			},
  			{
  				id: "45205",
  				label: "小林市",
  				maxZoom: 12
  			},
  			{
  				id: "45206",
  				label: "日向市",
  				maxZoom: 12
  			},
  			{
  				id: "45207",
  				label: "串間市",
  				maxZoom: 12
  			},
  			{
  				id: "45208",
  				label: "西都市",
  				maxZoom: 12
  			},
  			{
  				id: "45209",
  				label: "えびの市",
  				maxZoom: 12
  			},
  			{
  				id: "45341",
  				label: "三股町",
  				maxZoom: 12
  			},
  			{
  				id: "45361",
  				label: "高原町",
  				maxZoom: 12
  			},
  			{
  				id: "45382",
  				label: "国富町",
  				maxZoom: 12
  			},
  			{
  				id: "45383",
  				label: "綾町",
  				maxZoom: 12
  			},
  			{
  				id: "45401",
  				label: "高鍋町",
  				maxZoom: 12
  			},
  			{
  				id: "45402",
  				label: "新富町",
  				maxZoom: 12
  			},
  			{
  				id: "45403",
  				label: "西米良村",
  				maxZoom: 12
  			},
  			{
  				id: "45404",
  				label: "木城町",
  				maxZoom: 12
  			},
  			{
  				id: "45405",
  				label: "川南町",
  				maxZoom: 12
  			},
  			{
  				id: "45406",
  				label: "都農町",
  				maxZoom: 12
  			},
  			{
  				id: "45421",
  				label: "門川町",
  				maxZoom: 12
  			},
  			{
  				id: "45429",
  				label: "諸塚村",
  				maxZoom: 12
  			},
  			{
  				id: "45430",
  				label: "椎葉村",
  				maxZoom: 12
  			},
  			{
  				id: "45431",
  				label: "美郷町",
  				maxZoom: 12
  			},
  			{
  				id: "45441",
  				label: "高千穂町",
  				maxZoom: 12
  			},
  			{
  				id: "45442",
  				label: "日之影町",
  				maxZoom: 12
  			},
  			{
  				id: "45443",
  				label: "五ヶ瀬町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "46000",
  		label: "鹿児島県",
  		children: [
  			{
  				id: "46201",
  				label: "鹿児島市",
  				maxZoom: 12
  			},
  			{
  				id: "46203",
  				label: "鹿屋市",
  				maxZoom: 12
  			},
  			{
  				id: "46204",
  				label: "枕崎市",
  				maxZoom: 12
  			},
  			{
  				id: "46206",
  				label: "阿久根市",
  				maxZoom: 12
  			},
  			{
  				id: "46208",
  				label: "出水市",
  				maxZoom: 12
  			},
  			{
  				id: "46210",
  				label: "指宿市",
  				maxZoom: 12
  			},
  			{
  				id: "46213",
  				label: "西之表市",
  				maxZoom: 12
  			},
  			{
  				id: "46214",
  				label: "垂水市",
  				maxZoom: 12
  			},
  			{
  				id: "46215",
  				label: "薩摩川内市",
  				maxZoom: 12
  			},
  			{
  				id: "46216",
  				label: "日置市",
  				maxZoom: 12
  			},
  			{
  				id: "46217",
  				label: "曽於市",
  				maxZoom: 12
  			},
  			{
  				id: "46218",
  				label: "霧島市",
  				maxZoom: 12
  			},
  			{
  				id: "46219",
  				label: "いちき串木野市",
  				maxZoom: 12
  			},
  			{
  				id: "46220",
  				label: "南さつま市",
  				maxZoom: 12
  			},
  			{
  				id: "46221",
  				label: "志布志市",
  				maxZoom: 12
  			},
  			{
  				id: "46222",
  				label: "奄美市",
  				maxZoom: 12
  			},
  			{
  				id: "46223",
  				label: "南九州市",
  				maxZoom: 12
  			},
  			{
  				id: "46224",
  				label: "伊佐市",
  				maxZoom: 12
  			},
  			{
  				id: "46225",
  				label: "姶良市",
  				maxZoom: 12
  			},
  			{
  				id: "46303",
  				label: "三島村",
  				maxZoom: 12
  			},
  			{
  				id: "46304",
  				label: "十島村",
  				maxZoom: 12
  			},
  			{
  				id: "46392",
  				label: "さつま町",
  				maxZoom: 12
  			},
  			{
  				id: "46404",
  				label: "長島町",
  				maxZoom: 12
  			},
  			{
  				id: "46452",
  				label: "湧水町",
  				maxZoom: 12
  			},
  			{
  				id: "46468",
  				label: "大崎町",
  				maxZoom: 12
  			},
  			{
  				id: "46482",
  				label: "東串良町",
  				maxZoom: 12
  			},
  			{
  				id: "46490",
  				label: "錦江町",
  				maxZoom: 12
  			},
  			{
  				id: "46491",
  				label: "南大隅町",
  				maxZoom: 12
  			},
  			{
  				id: "46492",
  				label: "肝付町",
  				maxZoom: 12
  			},
  			{
  				id: "46501",
  				label: "中種子町",
  				maxZoom: 12
  			},
  			{
  				id: "46502",
  				label: "南種子町",
  				maxZoom: 12
  			},
  			{
  				id: "46505",
  				label: "屋久島町",
  				maxZoom: 12
  			},
  			{
  				id: "46523",
  				label: "大和村",
  				maxZoom: 12
  			},
  			{
  				id: "46524",
  				label: "宇検村",
  				maxZoom: 12
  			},
  			{
  				id: "46525",
  				label: "瀬戸内町",
  				maxZoom: 12
  			},
  			{
  				id: "46527",
  				label: "龍郷町",
  				maxZoom: 12
  			},
  			{
  				id: "46529",
  				label: "喜界町",
  				maxZoom: 12
  			},
  			{
  				id: "46530",
  				label: "徳之島町",
  				maxZoom: 12
  			},
  			{
  				id: "46531",
  				label: "天城町",
  				maxZoom: 12
  			},
  			{
  				id: "46532",
  				label: "伊仙町",
  				maxZoom: 12
  			},
  			{
  				id: "46533",
  				label: "和泊町",
  				maxZoom: 12
  			},
  			{
  				id: "46534",
  				label: "知名町",
  				maxZoom: 12
  			},
  			{
  				id: "46535",
  				label: "与論町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "47000",
  		label: "沖縄県",
  		children: [
  			{
  				id: "47201",
  				label: "那覇市",
  				maxZoom: 12
  			},
  			{
  				id: "47205",
  				label: "宜野湾市",
  				maxZoom: 12
  			},
  			{
  				id: "47207",
  				label: "石垣市",
  				maxZoom: 12
  			},
  			{
  				id: "47208",
  				label: "浦添市",
  				maxZoom: 12
  			},
  			{
  				id: "47209",
  				label: "名護市",
  				maxZoom: 12
  			},
  			{
  				id: "47210",
  				label: "糸満市",
  				maxZoom: 12
  			},
  			{
  				id: "47211",
  				label: "沖縄市",
  				maxZoom: 12
  			},
  			{
  				id: "47212",
  				label: "豊見城市",
  				maxZoom: 12
  			},
  			{
  				id: "47213",
  				label: "うるま市",
  				maxZoom: 12
  			},
  			{
  				id: "47214",
  				label: "宮古島市",
  				maxZoom: 12
  			},
  			{
  				id: "47215",
  				label: "南城市",
  				maxZoom: 12
  			},
  			{
  				id: "47301",
  				label: "国頭村",
  				maxZoom: 12
  			},
  			{
  				id: "47302",
  				label: "大宜味村",
  				maxZoom: 12
  			},
  			{
  				id: "47303",
  				label: "東村",
  				maxZoom: 12
  			},
  			{
  				id: "47306",
  				label: "今帰仁村",
  				maxZoom: 12
  			},
  			{
  				id: "47308",
  				label: "本部町",
  				maxZoom: 12
  			},
  			{
  				id: "47311",
  				label: "恩納村",
  				maxZoom: 12
  			},
  			{
  				id: "47313",
  				label: "宜野座村",
  				maxZoom: 12
  			},
  			{
  				id: "47314",
  				label: "金武町",
  				maxZoom: 12
  			},
  			{
  				id: "47315",
  				label: "伊江村",
  				maxZoom: 12
  			},
  			{
  				id: "47324",
  				label: "読谷村",
  				maxZoom: 12
  			},
  			{
  				id: "47325",
  				label: "嘉手納町",
  				maxZoom: 12
  			},
  			{
  				id: "47326",
  				label: "北谷町",
  				maxZoom: 12
  			},
  			{
  				id: "47327",
  				label: "北中城村",
  				maxZoom: 12
  			},
  			{
  				id: "47328",
  				label: "中城村",
  				maxZoom: 12
  			},
  			{
  				id: "47329",
  				label: "西原町",
  				maxZoom: 12
  			},
  			{
  				id: "47348",
  				label: "与那原町",
  				maxZoom: 12
  			},
  			{
  				id: "47350",
  				label: "南風原町",
  				maxZoom: 12
  			},
  			{
  				id: "47353",
  				label: "渡嘉敷村",
  				maxZoom: 12
  			},
  			{
  				id: "47354",
  				label: "座間味村",
  				maxZoom: 12
  			},
  			{
  				id: "47355",
  				label: "粟国村",
  				maxZoom: 12
  			},
  			{
  				id: "47356",
  				label: "渡名喜村",
  				maxZoom: 12
  			},
  			{
  				id: "47357",
  				label: "南大東村",
  				maxZoom: 12
  			},
  			{
  				id: "47358",
  				label: "北大東村",
  				maxZoom: 12
  			},
  			{
  				id: "47359",
  				label: "伊平屋村",
  				maxZoom: 12
  			},
  			{
  				id: "47360",
  				label: "伊是名村",
  				maxZoom: 12
  			},
  			{
  				id: "47361",
  				label: "久米島町",
  				maxZoom: 12
  			},
  			{
  				id: "47362",
  				label: "八重瀬町",
  				maxZoom: 12
  			},
  			{
  				id: "47375",
  				label: "多良間村",
  				maxZoom: 12
  			},
  			{
  				id: "47381",
  				label: "竹富町",
  				maxZoom: 12
  			},
  			{
  				id: "47382",
  				label: "与那国町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "04000",
  		label: "宮城県",
  		children: [
  			{
  				id: "04209",
  				label: "多賀城市",
  				maxZoom: 12
  			},
  			{
  				id: "04205",
  				label: "気仙沼市",
  				maxZoom: 12
  			},
  			{
  				id: "04445",
  				label: "加美町",
  				maxZoom: 12
  			},
  			{
  				id: "04444",
  				label: "色麻町",
  				maxZoom: 12
  			},
  			{
  				id: "04207",
  				label: "名取市",
  				maxZoom: 12
  			},
  			{
  				id: "04206",
  				label: "白石市",
  				maxZoom: 12
  			},
  			{
  				id: "04606",
  				label: "南三陸町",
  				maxZoom: 12
  			},
  			{
  				id: "04203",
  				label: "塩竈市",
  				maxZoom: 12
  			},
  			{
  				id: "04216",
  				label: "富谷市",
  				maxZoom: 12
  			},
  			{
  				id: "04213",
  				label: "栗原市",
  				maxZoom: 12
  			},
  			{
  				id: "04341",
  				label: "丸森町",
  				maxZoom: 12
  			},
  			{
  				id: "04404",
  				label: "七ヶ浜町",
  				maxZoom: 12
  			},
  			{
  				id: "04401",
  				label: "松島町",
  				maxZoom: 12
  			},
  			{
  				id: "04406",
  				label: "利府町",
  				maxZoom: 12
  			},
  			{
  				id: "04202",
  				label: "石巻市",
  				maxZoom: 12
  			},
  			{
  				id: "04100",
  				label: "仙台市",
  				children: [
  					{
  						id: "04105",
  						label: "泉区",
  						maxZoom: 12
  					},
  					{
  						id: "04103",
  						label: "若林区",
  						maxZoom: 12
  					},
  					{
  						id: "04102",
  						label: "宮城野区",
  						maxZoom: 12
  					},
  					{
  						id: "04101",
  						label: "青葉区",
  						maxZoom: 12
  					},
  					{
  						id: "04104",
  						label: "太白区",
  						maxZoom: 12
  					}
  				],
  				maxZoom: 10
  			},
  			{
  				id: "04581",
  				label: "女川町",
  				maxZoom: 12
  			},
  			{
  				id: "04301",
  				label: "蔵王町",
  				maxZoom: 12
  			},
  			{
  				id: "04302",
  				label: "七ヶ宿町",
  				maxZoom: 12
  			},
  			{
  				id: "04208",
  				label: "角田市",
  				maxZoom: 12
  			},
  			{
  				id: "04215",
  				label: "大崎市",
  				maxZoom: 12
  			},
  			{
  				id: "04362",
  				label: "山元町",
  				maxZoom: 12
  			},
  			{
  				id: "04361",
  				label: "亘理町",
  				maxZoom: 12
  			},
  			{
  				id: "04211",
  				label: "岩沼市",
  				maxZoom: 12
  			},
  			{
  				id: "04214",
  				label: "東松島市",
  				maxZoom: 12
  			},
  			{
  				id: "04424",
  				label: "大衡村",
  				maxZoom: 12
  			},
  			{
  				id: "04422",
  				label: "大郷町",
  				maxZoom: 12
  			},
  			{
  				id: "04421",
  				label: "大和町",
  				maxZoom: 12
  			},
  			{
  				id: "04323",
  				label: "柴田町",
  				maxZoom: 12
  			},
  			{
  				id: "04322",
  				label: "村田町",
  				maxZoom: 12
  			},
  			{
  				id: "04321",
  				label: "大河原町",
  				maxZoom: 12
  			},
  			{
  				id: "04324",
  				label: "川崎町",
  				maxZoom: 12
  			},
  			{
  				id: "04212",
  				label: "登米市",
  				maxZoom: 12
  			},
  			{
  				id: "04505",
  				label: "美里町",
  				maxZoom: 12
  			},
  			{
  				id: "04501",
  				label: "涌谷町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "07000",
  		label: "福島県",
  		children: [
  			{
  				id: "07207",
  				label: "須賀川市",
  				maxZoom: 12
  			},
  			{
  				id: "07205",
  				label: "白河市",
  				maxZoom: 12
  			},
  			{
  				id: "07208",
  				label: "喜多方市",
  				maxZoom: 12
  			},
  			{
  				id: "07211",
  				label: "田村市",
  				maxZoom: 12
  			},
  			{
  				id: "07421",
  				label: "会津坂下町",
  				maxZoom: 12
  			},
  			{
  				id: "07422",
  				label: "湯川村",
  				maxZoom: 12
  			},
  			{
  				id: "07423",
  				label: "柳津町",
  				maxZoom: 12
  			},
  			{
  				id: "07212",
  				label: "南相馬市",
  				maxZoom: 12
  			},
  			{
  				id: "07464",
  				label: "泉崎村",
  				maxZoom: 12
  			},
  			{
  				id: "07466",
  				label: "矢吹町",
  				maxZoom: 12
  			},
  			{
  				id: "07465",
  				label: "中島村",
  				maxZoom: 12
  			},
  			{
  				id: "07461",
  				label: "西郷村",
  				maxZoom: 12
  			},
  			{
  				id: "07308",
  				label: "川俣町",
  				maxZoom: 12
  			},
  			{
  				id: "07301",
  				label: "桑折町",
  				maxZoom: 12
  			},
  			{
  				id: "07303",
  				label: "国見町",
  				maxZoom: 12
  			},
  			{
  				id: "07447",
  				label: "会津美里町",
  				maxZoom: 12
  			},
  			{
  				id: "07445",
  				label: "金山町",
  				maxZoom: 12
  			},
  			{
  				id: "07446",
  				label: "昭和村",
  				maxZoom: 12
  			},
  			{
  				id: "07444",
  				label: "三島町",
  				maxZoom: 12
  			},
  			{
  				id: "07407",
  				label: "磐梯町",
  				maxZoom: 12
  			},
  			{
  				id: "07408",
  				label: "猪苗代町",
  				maxZoom: 12
  			},
  			{
  				id: "07402",
  				label: "北塩原村",
  				maxZoom: 12
  			},
  			{
  				id: "07405",
  				label: "西会津町",
  				maxZoom: 12
  			},
  			{
  				id: "07502",
  				label: "玉川村",
  				maxZoom: 12
  			},
  			{
  				id: "07503",
  				label: "平田村",
  				maxZoom: 12
  			},
  			{
  				id: "07501",
  				label: "石川町",
  				maxZoom: 12
  			},
  			{
  				id: "07505",
  				label: "古殿町",
  				maxZoom: 12
  			},
  			{
  				id: "07504",
  				label: "浅川町",
  				maxZoom: 12
  			},
  			{
  				id: "07202",
  				label: "会津若松市",
  				maxZoom: 12
  			},
  			{
  				id: "07342",
  				label: "鏡石町",
  				maxZoom: 12
  			},
  			{
  				id: "07344",
  				label: "天栄村",
  				maxZoom: 12
  			},
  			{
  				id: "07210",
  				label: "二本松市",
  				maxZoom: 12
  			},
  			{
  				id: "07543",
  				label: "富岡町",
  				maxZoom: 12
  			},
  			{
  				id: "07544",
  				label: "川内村",
  				maxZoom: 12
  			},
  			{
  				id: "07542",
  				label: "楢葉町",
  				maxZoom: 12
  			},
  			{
  				id: "07545",
  				label: "大熊町",
  				maxZoom: 12
  			},
  			{
  				id: "07546",
  				label: "双葉町",
  				maxZoom: 12
  			},
  			{
  				id: "07547",
  				label: "浪江町",
  				maxZoom: 12
  			},
  			{
  				id: "07548",
  				label: "葛尾村",
  				maxZoom: 12
  			},
  			{
  				id: "07541",
  				label: "広野町",
  				maxZoom: 12
  			},
  			{
  				id: "07521",
  				label: "三春町",
  				maxZoom: 12
  			},
  			{
  				id: "07522",
  				label: "小野町",
  				maxZoom: 12
  			},
  			{
  				id: "07213",
  				label: "伊達市",
  				maxZoom: 12
  			},
  			{
  				id: "07484",
  				label: "鮫川村",
  				maxZoom: 12
  			},
  			{
  				id: "07481",
  				label: "棚倉町",
  				maxZoom: 12
  			},
  			{
  				id: "07482",
  				label: "矢祭町",
  				maxZoom: 12
  			},
  			{
  				id: "07483",
  				label: "塙町",
  				maxZoom: 12
  			},
  			{
  				id: "07204",
  				label: "いわき市",
  				maxZoom: 12
  			},
  			{
  				id: "07201",
  				label: "福島市",
  				maxZoom: 12
  			},
  			{
  				id: "07214",
  				label: "本宮市",
  				maxZoom: 12
  			},
  			{
  				id: "07368",
  				label: "南会津町",
  				maxZoom: 12
  			},
  			{
  				id: "07364",
  				label: "檜枝岐村",
  				maxZoom: 12
  			},
  			{
  				id: "07367",
  				label: "只見町",
  				maxZoom: 12
  			},
  			{
  				id: "07362",
  				label: "下郷町",
  				maxZoom: 12
  			},
  			{
  				id: "07561",
  				label: "新地町",
  				maxZoom: 12
  			},
  			{
  				id: "07564",
  				label: "飯舘村",
  				maxZoom: 12
  			},
  			{
  				id: "07203",
  				label: "郡山市",
  				maxZoom: 12
  			},
  			{
  				id: "07322",
  				label: "大玉村",
  				maxZoom: 12
  			},
  			{
  				id: "07209",
  				label: "相馬市",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "08000",
  		label: "茨城県",
  		children: [
  			{
  				id: "08216",
  				label: "笠間市",
  				maxZoom: 12
  			},
  			{
  				id: "08228",
  				label: "坂東市",
  				maxZoom: 12
  			},
  			{
  				id: "08207",
  				label: "結城市",
  				maxZoom: 12
  			},
  			{
  				id: "08232",
  				label: "神栖市",
  				maxZoom: 12
  			},
  			{
  				id: "08204",
  				label: "古河市",
  				maxZoom: 12
  			},
  			{
  				id: "08364",
  				label: "大子町",
  				maxZoom: 12
  			},
  			{
  				id: "08231",
  				label: "桜川市",
  				maxZoom: 12
  			},
  			{
  				id: "08223",
  				label: "潮来市",
  				maxZoom: 12
  			},
  			{
  				id: "08564",
  				label: "利根町",
  				maxZoom: 12
  			},
  			{
  				id: "08310",
  				label: "城里町",
  				maxZoom: 12
  			},
  			{
  				id: "08309",
  				label: "大洗町",
  				maxZoom: 12
  			},
  			{
  				id: "08302",
  				label: "茨城町",
  				maxZoom: 12
  			},
  			{
  				id: "08203",
  				label: "土浦市",
  				maxZoom: 12
  			},
  			{
  				id: "08229",
  				label: "稲敷市",
  				maxZoom: 12
  			},
  			{
  				id: "08220",
  				label: "つくば市",
  				maxZoom: 12
  			},
  			{
  				id: "08234",
  				label: "鉾田市",
  				maxZoom: 12
  			},
  			{
  				id: "08202",
  				label: "日立市",
  				maxZoom: 12
  			},
  			{
  				id: "08208",
  				label: "龍ケ崎市",
  				maxZoom: 12
  			},
  			{
  				id: "08205",
  				label: "石岡市",
  				maxZoom: 12
  			},
  			{
  				id: "08222",
  				label: "鹿嶋市",
  				maxZoom: 12
  			},
  			{
  				id: "08233",
  				label: "行方市",
  				maxZoom: 12
  			},
  			{
  				id: "08521",
  				label: "八千代町",
  				maxZoom: 12
  			},
  			{
  				id: "08219",
  				label: "牛久市",
  				maxZoom: 12
  			},
  			{
  				id: "08230",
  				label: "かすみがうら市",
  				maxZoom: 12
  			},
  			{
  				id: "08217",
  				label: "取手市",
  				maxZoom: 12
  			},
  			{
  				id: "08215",
  				label: "北茨城市",
  				maxZoom: 12
  			},
  			{
  				id: "08212",
  				label: "常陸太田市",
  				maxZoom: 12
  			},
  			{
  				id: "08235",
  				label: "つくばみらい市",
  				maxZoom: 12
  			},
  			{
  				id: "08201",
  				label: "水戸市",
  				maxZoom: 12
  			},
  			{
  				id: "08226",
  				label: "那珂市",
  				maxZoom: 12
  			},
  			{
  				id: "08210",
  				label: "下妻市",
  				maxZoom: 12
  			},
  			{
  				id: "08341",
  				label: "東海村",
  				maxZoom: 12
  			},
  			{
  				id: "08221",
  				label: "ひたちなか市",
  				maxZoom: 12
  			},
  			{
  				id: "08214",
  				label: "高萩市",
  				maxZoom: 12
  			},
  			{
  				id: "08224",
  				label: "守谷市",
  				maxZoom: 12
  			},
  			{
  				id: "08227",
  				label: "筑西市",
  				maxZoom: 12
  			},
  			{
  				id: "08236",
  				label: "小美玉市",
  				maxZoom: 12
  			},
  			{
  				id: "08447",
  				label: "河内町",
  				maxZoom: 12
  			},
  			{
  				id: "08442",
  				label: "美浦村",
  				maxZoom: 12
  			},
  			{
  				id: "08443",
  				label: "阿見町",
  				maxZoom: 12
  			},
  			{
  				id: "08546",
  				label: "境町",
  				maxZoom: 12
  			},
  			{
  				id: "08542",
  				label: "五霞町",
  				maxZoom: 12
  			},
  			{
  				id: "08211",
  				label: "常総市",
  				maxZoom: 12
  			},
  			{
  				id: "08225",
  				label: "常陸大宮市",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "02000",
  		label: "青森県",
  		children: [
  			{
  				id: "02303",
  				label: "今別町",
  				maxZoom: 12
  			},
  			{
  				id: "02307",
  				label: "外ヶ浜町",
  				maxZoom: 12
  			},
  			{
  				id: "02301",
  				label: "平内町",
  				maxZoom: 12
  			},
  			{
  				id: "02304",
  				label: "蓬田村",
  				maxZoom: 12
  			},
  			{
  				id: "02206",
  				label: "十和田市",
  				maxZoom: 12
  			},
  			{
  				id: "02450",
  				label: "新郷村",
  				maxZoom: 12
  			},
  			{
  				id: "02445",
  				label: "南部町",
  				maxZoom: 12
  			},
  			{
  				id: "02441",
  				label: "三戸町",
  				maxZoom: 12
  			},
  			{
  				id: "02446",
  				label: "階上町",
  				maxZoom: 12
  			},
  			{
  				id: "02442",
  				label: "五戸町",
  				maxZoom: 12
  			},
  			{
  				id: "02443",
  				label: "田子町",
  				maxZoom: 12
  			},
  			{
  				id: "02205",
  				label: "五所川原市",
  				maxZoom: 12
  			},
  			{
  				id: "02202",
  				label: "弘前市",
  				maxZoom: 12
  			},
  			{
  				id: "02321",
  				label: "鰺ヶ沢町",
  				maxZoom: 12
  			},
  			{
  				id: "02323",
  				label: "深浦町",
  				maxZoom: 12
  			},
  			{
  				id: "02362",
  				label: "大鰐町",
  				maxZoom: 12
  			},
  			{
  				id: "02361",
  				label: "藤崎町",
  				maxZoom: 12
  			},
  			{
  				id: "02367",
  				label: "田舎館村",
  				maxZoom: 12
  			},
  			{
  				id: "02204",
  				label: "黒石市",
  				maxZoom: 12
  			},
  			{
  				id: "02210",
  				label: "平川市",
  				maxZoom: 12
  			},
  			{
  				id: "02343",
  				label: "西目屋村",
  				maxZoom: 12
  			},
  			{
  				id: "02425",
  				label: "風間浦村",
  				maxZoom: 12
  			},
  			{
  				id: "02423",
  				label: "大間町",
  				maxZoom: 12
  			},
  			{
  				id: "02426",
  				label: "佐井村",
  				maxZoom: 12
  			},
  			{
  				id: "02424",
  				label: "東通村",
  				maxZoom: 12
  			},
  			{
  				id: "02209",
  				label: "つがる市",
  				maxZoom: 12
  			},
  			{
  				id: "02208",
  				label: "むつ市",
  				maxZoom: 12
  			},
  			{
  				id: "02207",
  				label: "三沢市",
  				maxZoom: 12
  			},
  			{
  				id: "02203",
  				label: "八戸市",
  				maxZoom: 12
  			},
  			{
  				id: "02201",
  				label: "青森市",
  				maxZoom: 12
  			},
  			{
  				id: "02406",
  				label: "横浜町",
  				maxZoom: 12
  			},
  			{
  				id: "02401",
  				label: "野辺地町",
  				maxZoom: 12
  			},
  			{
  				id: "02405",
  				label: "六戸町",
  				maxZoom: 12
  			},
  			{
  				id: "02408",
  				label: "東北町",
  				maxZoom: 12
  			},
  			{
  				id: "02412",
  				label: "おいらせ町",
  				maxZoom: 12
  			},
  			{
  				id: "02402",
  				label: "七戸町",
  				maxZoom: 12
  			},
  			{
  				id: "02411",
  				label: "六ヶ所村",
  				maxZoom: 12
  			},
  			{
  				id: "02387",
  				label: "中泊町",
  				maxZoom: 12
  			},
  			{
  				id: "02384",
  				label: "鶴田町",
  				maxZoom: 12
  			},
  			{
  				id: "02381",
  				label: "板柳町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "03000",
  		label: "岩手県",
  		children: [
  			{
  				id: "03216",
  				label: "滝沢市",
  				maxZoom: 12
  			},
  			{
  				id: "03366",
  				label: "西和賀町",
  				maxZoom: 12
  			},
  			{
  				id: "03301",
  				label: "雫石町",
  				maxZoom: 12
  			},
  			{
  				id: "03302",
  				label: "葛巻町",
  				maxZoom: 12
  			},
  			{
  				id: "03303",
  				label: "岩手町",
  				maxZoom: 12
  			},
  			{
  				id: "03215",
  				label: "奥州市",
  				maxZoom: 12
  			},
  			{
  				id: "03402",
  				label: "平泉町",
  				maxZoom: 12
  			},
  			{
  				id: "03203",
  				label: "大船渡市",
  				maxZoom: 12
  			},
  			{
  				id: "03210",
  				label: "陸前高田市",
  				maxZoom: 12
  			},
  			{
  				id: "03213",
  				label: "二戸市",
  				maxZoom: 12
  			},
  			{
  				id: "03321",
  				label: "紫波町",
  				maxZoom: 12
  			},
  			{
  				id: "03322",
  				label: "矢巾町",
  				maxZoom: 12
  			},
  			{
  				id: "03209",
  				label: "一関市",
  				maxZoom: 12
  			},
  			{
  				id: "03524",
  				label: "一戸町",
  				maxZoom: 12
  			},
  			{
  				id: "03207",
  				label: "久慈市",
  				maxZoom: 12
  			},
  			{
  				id: "03202",
  				label: "宮古市",
  				maxZoom: 12
  			},
  			{
  				id: "03461",
  				label: "大槌町",
  				maxZoom: 12
  			},
  			{
  				id: "03201",
  				label: "盛岡市",
  				maxZoom: 12
  			},
  			{
  				id: "03205",
  				label: "花巻市",
  				maxZoom: 12
  			},
  			{
  				id: "03484",
  				label: "田野畑村",
  				maxZoom: 12
  			},
  			{
  				id: "03482",
  				label: "山田町",
  				maxZoom: 12
  			},
  			{
  				id: "03485",
  				label: "普代村",
  				maxZoom: 12
  			},
  			{
  				id: "03483",
  				label: "岩泉町",
  				maxZoom: 12
  			},
  			{
  				id: "03214",
  				label: "八幡平市",
  				maxZoom: 12
  			},
  			{
  				id: "03441",
  				label: "住田町",
  				maxZoom: 12
  			},
  			{
  				id: "03206",
  				label: "北上市",
  				maxZoom: 12
  			},
  			{
  				id: "03211",
  				label: "釜石市",
  				maxZoom: 12
  			},
  			{
  				id: "03507",
  				label: "洋野町",
  				maxZoom: 12
  			},
  			{
  				id: "03501",
  				label: "軽米町",
  				maxZoom: 12
  			},
  			{
  				id: "03503",
  				label: "野田村",
  				maxZoom: 12
  			},
  			{
  				id: "03506",
  				label: "九戸村",
  				maxZoom: 12
  			},
  			{
  				id: "03208",
  				label: "遠野市",
  				maxZoom: 12
  			},
  			{
  				id: "03381",
  				label: "金ケ崎町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "09000",
  		label: "栃木県",
  		children: [
  			{
  				id: "09361",
  				label: "壬生町",
  				maxZoom: 12
  			},
  			{
  				id: "09364",
  				label: "野木町",
  				maxZoom: 12
  			},
  			{
  				id: "09215",
  				label: "那須烏山市",
  				maxZoom: 12
  			},
  			{
  				id: "09216",
  				label: "下野市",
  				maxZoom: 12
  			},
  			{
  				id: "09214",
  				label: "さくら市",
  				maxZoom: 12
  			},
  			{
  				id: "09213",
  				label: "那須塩原市",
  				maxZoom: 12
  			},
  			{
  				id: "09210",
  				label: "大田原市",
  				maxZoom: 12
  			},
  			{
  				id: "09301",
  				label: "上三川町",
  				maxZoom: 12
  			},
  			{
  				id: "09342",
  				label: "益子町",
  				maxZoom: 12
  			},
  			{
  				id: "09343",
  				label: "茂木町",
  				maxZoom: 12
  			},
  			{
  				id: "09344",
  				label: "市貝町",
  				maxZoom: 12
  			},
  			{
  				id: "09345",
  				label: "芳賀町",
  				maxZoom: 12
  			},
  			{
  				id: "09205",
  				label: "鹿沼市",
  				maxZoom: 12
  			},
  			{
  				id: "09211",
  				label: "矢板市",
  				maxZoom: 12
  			},
  			{
  				id: "09203",
  				label: "栃木市",
  				maxZoom: 12
  			},
  			{
  				id: "09201",
  				label: "宇都宮市",
  				maxZoom: 12
  			},
  			{
  				id: "09206",
  				label: "日光市",
  				maxZoom: 12
  			},
  			{
  				id: "09407",
  				label: "那須町",
  				maxZoom: 12
  			},
  			{
  				id: "09411",
  				label: "那珂川町",
  				maxZoom: 12
  			},
  			{
  				id: "09384",
  				label: "塩谷町",
  				maxZoom: 12
  			},
  			{
  				id: "09386",
  				label: "高根沢町",
  				maxZoom: 12
  			},
  			{
  				id: "09204",
  				label: "佐野市",
  				maxZoom: 12
  			},
  			{
  				id: "09208",
  				label: "小山市",
  				maxZoom: 12
  			},
  			{
  				id: "09209",
  				label: "真岡市",
  				maxZoom: 12
  			},
  			{
  				id: "09202",
  				label: "足利市",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "06000",
  		label: "山形県",
  		children: [
  			{
  				id: "06209",
  				label: "長井市",
  				maxZoom: 12
  			},
  			{
  				id: "06204",
  				label: "酒田市",
  				maxZoom: 12
  			},
  			{
  				id: "06202",
  				label: "米沢市",
  				maxZoom: 12
  			},
  			{
  				id: "06402",
  				label: "白鷹町",
  				maxZoom: 12
  			},
  			{
  				id: "06403",
  				label: "飯豊町",
  				maxZoom: 12
  			},
  			{
  				id: "06401",
  				label: "小国町",
  				maxZoom: 12
  			},
  			{
  				id: "06362",
  				label: "最上町",
  				maxZoom: 12
  			},
  			{
  				id: "06366",
  				label: "鮭川村",
  				maxZoom: 12
  			},
  			{
  				id: "06365",
  				label: "大蔵村",
  				maxZoom: 12
  			},
  			{
  				id: "06361",
  				label: "金山町",
  				maxZoom: 12
  			},
  			{
  				id: "06363",
  				label: "舟形町",
  				maxZoom: 12
  			},
  			{
  				id: "06364",
  				label: "真室川町",
  				maxZoom: 12
  			},
  			{
  				id: "06367",
  				label: "戸沢村",
  				maxZoom: 12
  			},
  			{
  				id: "06210",
  				label: "天童市",
  				maxZoom: 12
  			},
  			{
  				id: "06382",
  				label: "川西町",
  				maxZoom: 12
  			},
  			{
  				id: "06381",
  				label: "高畠町",
  				maxZoom: 12
  			},
  			{
  				id: "06213",
  				label: "南陽市",
  				maxZoom: 12
  			},
  			{
  				id: "06207",
  				label: "上山市",
  				maxZoom: 12
  			},
  			{
  				id: "06321",
  				label: "河北町",
  				maxZoom: 12
  			},
  			{
  				id: "06322",
  				label: "西川町",
  				maxZoom: 12
  			},
  			{
  				id: "06324",
  				label: "大江町",
  				maxZoom: 12
  			},
  			{
  				id: "06323",
  				label: "朝日町",
  				maxZoom: 12
  			},
  			{
  				id: "06302",
  				label: "中山町",
  				maxZoom: 12
  			},
  			{
  				id: "06301",
  				label: "山辺町",
  				maxZoom: 12
  			},
  			{
  				id: "06428",
  				label: "庄内町",
  				maxZoom: 12
  			},
  			{
  				id: "06426",
  				label: "三川町",
  				maxZoom: 12
  			},
  			{
  				id: "06208",
  				label: "村山市",
  				maxZoom: 12
  			},
  			{
  				id: "06203",
  				label: "鶴岡市",
  				maxZoom: 12
  			},
  			{
  				id: "06461",
  				label: "遊佐町",
  				maxZoom: 12
  			},
  			{
  				id: "06201",
  				label: "山形市",
  				maxZoom: 12
  			},
  			{
  				id: "06206",
  				label: "寒河江市",
  				maxZoom: 12
  			},
  			{
  				id: "06205",
  				label: "新庄市",
  				maxZoom: 12
  			},
  			{
  				id: "06212",
  				label: "尾花沢市",
  				maxZoom: 12
  			},
  			{
  				id: "06211",
  				label: "東根市",
  				maxZoom: 12
  			},
  			{
  				id: "06341",
  				label: "大石田町",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	},
  	{
  		id: "01000",
  		label: "北海道",
  		children: [
  			{
  				label: "空知総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01222",
  						label: "三笠市",
  						maxZoom: 12
  					},
  					{
  						id: "01218",
  						label: "赤平市",
  						maxZoom: 12
  					},
  					{
  						id: "01215",
  						label: "美唄市",
  						maxZoom: 12
  					},
  					{
  						id: "01228",
  						label: "深川市",
  						maxZoom: 12
  					},
  					{
  						id: "01437",
  						label: "北竜町",
  						maxZoom: 12
  					},
  					{
  						id: "01430",
  						label: "月形町",
  						maxZoom: 12
  					},
  					{
  						id: "01423",
  						label: "南幌町",
  						maxZoom: 12
  					},
  					{
  						id: "01428",
  						label: "長沼町",
  						maxZoom: 12
  					},
  					{
  						id: "01425",
  						label: "上砂川町",
  						maxZoom: 12
  					},
  					{
  						id: "01433",
  						label: "妹背牛町",
  						maxZoom: 12
  					},
  					{
  						id: "01431",
  						label: "浦臼町",
  						maxZoom: 12
  					},
  					{
  						id: "01438",
  						label: "沼田町",
  						maxZoom: 12
  					},
  					{
  						id: "01429",
  						label: "栗山町",
  						maxZoom: 12
  					},
  					{
  						id: "01427",
  						label: "由仁町",
  						maxZoom: 12
  					},
  					{
  						id: "01434",
  						label: "秩父別町",
  						maxZoom: 12
  					},
  					{
  						id: "01432",
  						label: "新十津川町",
  						maxZoom: 12
  					},
  					{
  						id: "01436",
  						label: "雨竜町",
  						maxZoom: 12
  					},
  					{
  						id: "01424",
  						label: "奈井江町",
  						maxZoom: 12
  					},
  					{
  						id: "01209",
  						label: "夕張市",
  						maxZoom: 12
  					},
  					{
  						id: "01225",
  						label: "滝川市",
  						maxZoom: 12
  					},
  					{
  						id: "01227",
  						label: "歌志内市",
  						maxZoom: 12
  					},
  					{
  						id: "01216",
  						label: "芦別市",
  						maxZoom: 12
  					},
  					{
  						id: "01210",
  						label: "岩見沢市",
  						maxZoom: 12
  					},
  					{
  						id: "01226",
  						label: "砂川市",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "石狩振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01303",
  						label: "当別町",
  						maxZoom: 12
  					},
  					{
  						id: "01304",
  						label: "新篠津村",
  						maxZoom: 12
  					},
  					{
  						id: "01235",
  						label: "石狩市",
  						maxZoom: 12
  					},
  					{
  						id: "01231",
  						label: "恵庭市",
  						maxZoom: 12
  					},
  					{
  						id: "01217",
  						label: "江別市",
  						maxZoom: 12
  					},
  					{
  						id: "01224",
  						label: "千歳市",
  						maxZoom: 12
  					},
  					{
  						id: "01100",
  						label: "札幌市",
  						children: [
  							{
  								id: "01106",
  								label: "南区",
  								maxZoom: 12
  							},
  							{
  								id: "01104",
  								label: "白石区",
  								maxZoom: 12
  							},
  							{
  								id: "01103",
  								label: "東区",
  								maxZoom: 12
  							},
  							{
  								id: "01101",
  								label: "中央区",
  								maxZoom: 12
  							},
  							{
  								id: "01107",
  								label: "西区",
  								maxZoom: 12
  							},
  							{
  								id: "01102",
  								label: "北区",
  								maxZoom: 12
  							},
  							{
  								id: "01105",
  								label: "豊平区",
  								maxZoom: 12
  							},
  							{
  								id: "01109",
  								label: "手稲区",
  								maxZoom: 12
  							},
  							{
  								id: "01108",
  								label: "厚別区",
  								maxZoom: 12
  							},
  							{
  								id: "01110",
  								label: "清田区",
  								maxZoom: 12
  							}
  						],
  						maxZoom: 10
  					},
  					{
  						id: "01234",
  						label: "北広島市",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "後志総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01696",
  						label: "泊村",
  						maxZoom: 12
  					},
  					{
  						id: "01203",
  						label: "小樽市",
  						maxZoom: 12
  					},
  					{
  						id: "01407",
  						label: "仁木町",
  						maxZoom: 12
  					},
  					{
  						id: "01391",
  						label: "島牧村",
  						maxZoom: 12
  					},
  					{
  						id: "01393",
  						label: "黒松内町",
  						maxZoom: 12
  					},
  					{
  						id: "01400",
  						label: "倶知安町",
  						maxZoom: 12
  					},
  					{
  						id: "01403",
  						label: "泊村",
  						maxZoom: 12
  					},
  					{
  						id: "01392",
  						label: "寿都町",
  						maxZoom: 12
  					},
  					{
  						id: "01399",
  						label: "京極町",
  						maxZoom: 12
  					},
  					{
  						id: "01394",
  						label: "蘭越町",
  						maxZoom: 12
  					},
  					{
  						id: "01397",
  						label: "留寿都村",
  						maxZoom: 12
  					},
  					{
  						id: "01409",
  						label: "赤井川村",
  						maxZoom: 12
  					},
  					{
  						id: "01395",
  						label: "ニセコ町",
  						maxZoom: 12
  					},
  					{
  						id: "01401",
  						label: "共和町",
  						maxZoom: 12
  					},
  					{
  						id: "01396",
  						label: "真狩村",
  						maxZoom: 12
  					},
  					{
  						id: "01402",
  						label: "岩内町",
  						maxZoom: 12
  					},
  					{
  						id: "01406",
  						label: "古平町",
  						maxZoom: 12
  					},
  					{
  						id: "01398",
  						label: "喜茂別町",
  						maxZoom: 12
  					},
  					{
  						id: "01405",
  						label: "積丹町",
  						maxZoom: 12
  					},
  					{
  						id: "01408",
  						label: "余市町",
  						maxZoom: 12
  					},
  					{
  						id: "01404",
  						label: "神恵内村",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "胆振総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01585",
  						label: "安平町",
  						maxZoom: 12
  					},
  					{
  						id: "01581",
  						label: "厚真町",
  						maxZoom: 12
  					},
  					{
  						id: "01586",
  						label: "むかわ町",
  						maxZoom: 12
  					},
  					{
  						id: "01571",
  						label: "豊浦町",
  						maxZoom: 12
  					},
  					{
  						id: "01584",
  						label: "洞爺湖町",
  						maxZoom: 12
  					},
  					{
  						id: "01575",
  						label: "壮瞥町",
  						maxZoom: 12
  					},
  					{
  						id: "01233",
  						label: "伊達市",
  						maxZoom: 12
  					},
  					{
  						id: "01213",
  						label: "苫小牧市",
  						maxZoom: 12
  					},
  					{
  						id: "01230",
  						label: "登別市",
  						maxZoom: 12
  					},
  					{
  						id: "01205",
  						label: "室蘭市",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "日高振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01610",
  						label: "新ひだか町",
  						maxZoom: 12
  					},
  					{
  						id: "01604",
  						label: "新冠町",
  						maxZoom: 12
  					},
  					{
  						id: "01608",
  						label: "様似町",
  						maxZoom: 12
  					},
  					{
  						id: "01601",
  						label: "日高町",
  						maxZoom: 12
  					},
  					{
  						id: "01607",
  						label: "浦河町",
  						maxZoom: 12
  					},
  					{
  						id: "01602",
  						label: "平取町",
  						maxZoom: 12
  					},
  					{
  						id: "01609",
  						label: "えりも町",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "渡島総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01202",
  						label: "函館市",
  						maxZoom: 12
  					},
  					{
  						id: "01346",
  						label: "八雲町",
  						maxZoom: 12
  					},
  					{
  						id: "01347",
  						label: "長万部町",
  						maxZoom: 12
  					},
  					{
  						id: "01331",
  						label: "松前町",
  						maxZoom: 12
  					},
  					{
  						id: "01343",
  						label: "鹿部町",
  						maxZoom: 12
  					},
  					{
  						id: "01332",
  						label: "福島町",
  						maxZoom: 12
  					},
  					{
  						id: "01337",
  						label: "七飯町",
  						maxZoom: 12
  					},
  					{
  						id: "01345",
  						label: "森町",
  						maxZoom: 12
  					},
  					{
  						id: "01333",
  						label: "知内町",
  						maxZoom: 12
  					},
  					{
  						id: "01236",
  						label: "北斗市",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "檜山振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01370",
  						label: "今金町",
  						maxZoom: 12
  					},
  					{
  						id: "01371",
  						label: "せたな町",
  						maxZoom: 12
  					},
  					{
  						id: "01363",
  						label: "厚沢部町",
  						maxZoom: 12
  					},
  					{
  						id: "01362",
  						label: "上ノ国町",
  						maxZoom: 12
  					},
  					{
  						id: "01367",
  						label: "奥尻町",
  						maxZoom: 12
  					},
  					{
  						id: "01361",
  						label: "江差町",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "上川総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01204",
  						label: "旭川市",
  						maxZoom: 12
  					},
  					{
  						id: "01462",
  						label: "南富良野町",
  						maxZoom: 12
  					},
  					{
  						id: "01472",
  						label: "幌加内町",
  						maxZoom: 12
  					},
  					{
  						id: "01463",
  						label: "占冠村",
  						maxZoom: 12
  					},
  					{
  						id: "01457",
  						label: "上川町",
  						maxZoom: 12
  					},
  					{
  						id: "01465",
  						label: "剣淵町",
  						maxZoom: 12
  					},
  					{
  						id: "01464",
  						label: "和寒町",
  						maxZoom: 12
  					},
  					{
  						id: "01453",
  						label: "東神楽町",
  						maxZoom: 12
  					},
  					{
  						id: "01471",
  						label: "中川町",
  						maxZoom: 12
  					},
  					{
  						id: "01459",
  						label: "美瑛町",
  						maxZoom: 12
  					},
  					{
  						id: "01455",
  						label: "比布町",
  						maxZoom: 12
  					},
  					{
  						id: "01470",
  						label: "音威子府村",
  						maxZoom: 12
  					},
  					{
  						id: "01468",
  						label: "下川町",
  						maxZoom: 12
  					},
  					{
  						id: "01458",
  						label: "東川町",
  						maxZoom: 12
  					},
  					{
  						id: "01461",
  						label: "中富良野町",
  						maxZoom: 12
  					},
  					{
  						id: "01452",
  						label: "鷹栖町",
  						maxZoom: 12
  					},
  					{
  						id: "01469",
  						label: "美深町",
  						maxZoom: 12
  					},
  					{
  						id: "01454",
  						label: "当麻町",
  						maxZoom: 12
  					},
  					{
  						id: "01460",
  						label: "上富良野町",
  						maxZoom: 12
  					},
  					{
  						id: "01456",
  						label: "愛別町",
  						maxZoom: 12
  					},
  					{
  						id: "01229",
  						label: "富良野市",
  						maxZoom: 12
  					},
  					{
  						id: "01221",
  						label: "名寄市",
  						maxZoom: 12
  					},
  					{
  						id: "01220",
  						label: "士別市",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "留萌振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01485",
  						label: "初山別村",
  						maxZoom: 12
  					},
  					{
  						id: "01481",
  						label: "増毛町",
  						maxZoom: 12
  					},
  					{
  						id: "01484",
  						label: "羽幌町",
  						maxZoom: 12
  					},
  					{
  						id: "01483",
  						label: "苫前町",
  						maxZoom: 12
  					},
  					{
  						id: "01487",
  						label: "天塩町",
  						maxZoom: 12
  					},
  					{
  						id: "01486",
  						label: "遠別町",
  						maxZoom: 12
  					},
  					{
  						id: "01482",
  						label: "小平町",
  						maxZoom: 12
  					},
  					{
  						id: "01212",
  						label: "留萌市",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "宗谷総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01214",
  						label: "稚内市",
  						maxZoom: 12
  					},
  					{
  						id: "01517",
  						label: "礼文町",
  						maxZoom: 12
  					},
  					{
  						id: "01520",
  						label: "幌延町",
  						maxZoom: 12
  					},
  					{
  						id: "01511",
  						label: "猿払村",
  						maxZoom: 12
  					},
  					{
  						id: "01516",
  						label: "豊富町",
  						maxZoom: 12
  					},
  					{
  						id: "01513",
  						label: "中頓別町",
  						maxZoom: 12
  					},
  					{
  						id: "01512",
  						label: "浜頓別町",
  						maxZoom: 12
  					},
  					{
  						id: "01519",
  						label: "利尻富士町",
  						maxZoom: 12
  					},
  					{
  						id: "01514",
  						label: "枝幸町",
  						maxZoom: 12
  					},
  					{
  						id: "01518",
  						label: "利尻町",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "オホーツク総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01219",
  						label: "紋別市",
  						maxZoom: 12
  					},
  					{
  						id: "01211",
  						label: "網走市",
  						maxZoom: 12
  					},
  					{
  						id: "01208",
  						label: "北見市",
  						maxZoom: 12
  					},
  					{
  						id: "01546",
  						label: "清里町",
  						maxZoom: 12
  					},
  					{
  						id: "01545",
  						label: "斜里町",
  						maxZoom: 12
  					},
  					{
  						id: "01562",
  						label: "西興部村",
  						maxZoom: 12
  					},
  					{
  						id: "01561",
  						label: "興部町",
  						maxZoom: 12
  					},
  					{
  						id: "01549",
  						label: "訓子府町",
  						maxZoom: 12
  					},
  					{
  						id: "01550",
  						label: "置戸町",
  						maxZoom: 12
  					},
  					{
  						id: "01560",
  						label: "滝上町",
  						maxZoom: 12
  					},
  					{
  						id: "01543",
  						label: "美幌町",
  						maxZoom: 12
  					},
  					{
  						id: "01544",
  						label: "津別町",
  						maxZoom: 12
  					},
  					{
  						id: "01552",
  						label: "佐呂間町",
  						maxZoom: 12
  					},
  					{
  						id: "01555",
  						label: "遠軽町",
  						maxZoom: 12
  					},
  					{
  						id: "01563",
  						label: "雄武町",
  						maxZoom: 12
  					},
  					{
  						id: "01564",
  						label: "大空町",
  						maxZoom: 12
  					},
  					{
  						id: "01559",
  						label: "湧別町",
  						maxZoom: 12
  					},
  					{
  						id: "01547",
  						label: "小清水町",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "十勝総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01647",
  						label: "足寄町",
  						maxZoom: 12
  					},
  					{
  						id: "01649",
  						label: "浦幌町",
  						maxZoom: 12
  					},
  					{
  						id: "01636",
  						label: "清水町",
  						maxZoom: 12
  					},
  					{
  						id: "01643",
  						label: "幕別町",
  						maxZoom: 12
  					},
  					{
  						id: "01634",
  						label: "鹿追町",
  						maxZoom: 12
  					},
  					{
  						id: "01633",
  						label: "上士幌町",
  						maxZoom: 12
  					},
  					{
  						id: "01641",
  						label: "大樹町",
  						maxZoom: 12
  					},
  					{
  						id: "01631",
  						label: "音更町",
  						maxZoom: 12
  					},
  					{
  						id: "01638",
  						label: "中札内村",
  						maxZoom: 12
  					},
  					{
  						id: "01637",
  						label: "芽室町",
  						maxZoom: 12
  					},
  					{
  						id: "01648",
  						label: "陸別町",
  						maxZoom: 12
  					},
  					{
  						id: "01646",
  						label: "本別町",
  						maxZoom: 12
  					},
  					{
  						id: "01644",
  						label: "池田町",
  						maxZoom: 12
  					},
  					{
  						id: "01642",
  						label: "広尾町",
  						maxZoom: 12
  					},
  					{
  						id: "01639",
  						label: "更別村",
  						maxZoom: 12
  					},
  					{
  						id: "01645",
  						label: "豊頃町",
  						maxZoom: 12
  					},
  					{
  						id: "01635",
  						label: "新得町",
  						maxZoom: 12
  					},
  					{
  						id: "01632",
  						label: "士幌町",
  						maxZoom: 12
  					},
  					{
  						id: "01207",
  						label: "帯広市",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "釧路総合振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01206",
  						label: "釧路市",
  						maxZoom: 12
  					},
  					{
  						id: "01661",
  						label: "釧路町",
  						maxZoom: 12
  					},
  					{
  						id: "01664",
  						label: "標茶町",
  						maxZoom: 12
  					},
  					{
  						id: "01665",
  						label: "弟子屈町",
  						maxZoom: 12
  					},
  					{
  						id: "01662",
  						label: "厚岸町",
  						maxZoom: 12
  					},
  					{
  						id: "01667",
  						label: "鶴居村",
  						maxZoom: 12
  					},
  					{
  						id: "01668",
  						label: "白糠町",
  						maxZoom: 12
  					},
  					{
  						id: "01663",
  						label: "浜中町",
  						maxZoom: 12
  					}
  				]
  			},
  			{
  				label: "根室振興局",
  				maxZoom: 8,
  				children: [
  					{
  						id: "01223",
  						label: "根室市",
  						maxZoom: 12
  					},
  					{
  						id: "01692",
  						label: "中標津町",
  						maxZoom: 12
  					},
  					{
  						id: "01693",
  						label: "標津町",
  						maxZoom: 12
  					},
  					{
  						id: "01691",
  						label: "別海町",
  						maxZoom: 12
  					},
  					{
  						id: "01694",
  						label: "羅臼町",
  						maxZoom: 12
  					}
  				]
  			}
  		],
  		maxZoom: 6
  	},
  	{
  		id: "05000",
  		label: "秋田県",
  		children: [
  			{
  				id: "05201",
  				label: "秋田市",
  				maxZoom: 12
  			},
  			{
  				id: "05215",
  				label: "仙北市",
  				maxZoom: 12
  			},
  			{
  				id: "05211",
  				label: "潟上市",
  				maxZoom: 12
  			},
  			{
  				id: "05207",
  				label: "湯沢市",
  				maxZoom: 12
  			},
  			{
  				id: "05327",
  				label: "上小阿仁村",
  				maxZoom: 12
  			},
  			{
  				id: "05206",
  				label: "男鹿市",
  				maxZoom: 12
  			},
  			{
  				id: "05203",
  				label: "横手市",
  				maxZoom: 12
  			},
  			{
  				id: "05434",
  				label: "美郷町",
  				maxZoom: 12
  			},
  			{
  				id: "05361",
  				label: "五城目町",
  				maxZoom: 12
  			},
  			{
  				id: "05363",
  				label: "八郎潟町",
  				maxZoom: 12
  			},
  			{
  				id: "05368",
  				label: "大潟村",
  				maxZoom: 12
  			},
  			{
  				id: "05366",
  				label: "井川町",
  				maxZoom: 12
  			},
  			{
  				id: "05303",
  				label: "小坂町",
  				maxZoom: 12
  			},
  			{
  				id: "05214",
  				label: "にかほ市",
  				maxZoom: 12
  			},
  			{
  				id: "05212",
  				label: "大仙市",
  				maxZoom: 12
  			},
  			{
  				id: "05210",
  				label: "由利本荘市",
  				maxZoom: 12
  			},
  			{
  				id: "05213",
  				label: "北秋田市",
  				maxZoom: 12
  			},
  			{
  				id: "05348",
  				label: "三種町",
  				maxZoom: 12
  			},
  			{
  				id: "05346",
  				label: "藤里町",
  				maxZoom: 12
  			},
  			{
  				id: "05349",
  				label: "八峰町",
  				maxZoom: 12
  			},
  			{
  				id: "05209",
  				label: "鹿角市",
  				maxZoom: 12
  			},
  			{
  				id: "05204",
  				label: "大館市",
  				maxZoom: 12
  			},
  			{
  				id: "05464",
  				label: "東成瀬村",
  				maxZoom: 12
  			},
  			{
  				id: "05463",
  				label: "羽後町",
  				maxZoom: 12
  			},
  			{
  				id: "05202",
  				label: "能代市",
  				maxZoom: 12
  			}
  		],
  		maxZoom: 8
  	}
  ];
  var maxZoom = 4;
  var areaCodeDefinition = {
  	label: label,
  	children: children,
  	maxZoom: maxZoom
  };

  (function(L) {
    L.areaCodeCluster.japan = function(markers, options) {
      return new L.AreaCodeCluster(areaCodeDefinition, markers, options);
    };
  })(window.L);

}());
