---
layout: post
title: 2024年2月选手数据统计
date: 2024-02-01
tags: 雀魂-赛事数据

---

## 数据统计
- 文件下载地址: [点我>>github](https://github.com/zhumisai/zhumisai.github.io/blob/master/_data/summary.csv)

<style data-styled="active" data-styled-version="5.3.6"></style>
<table class="bUEzXH" >
  <thead>
  <tr class="react-csv-row">
  {% for cell in site.data.summary[0] %}
        <th class="react-csv-cell--header react-csv-cell">{{ cell[0]}}</th>
  {% endfor %}
  </tr>
  </thead>
  <tbody class="react-csv-table-body">
  {% for member in site.data.summary %}
    <tr class="react-csv-row">
      {% for cell in member %}
        <td class="react-csv-cell">{{ cell[1] }}</td>
      {% endfor %}
    </tr>
  {% endfor %}
  </tbody>
</table>

