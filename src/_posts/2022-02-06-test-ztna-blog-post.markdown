---
layout: ztna-post
title: "Linux, Cockpit And Enclave"
date: 2022-02-06 23:37:13 +0600
categories: [architecture, SD-WAN, SDP]
author: "Tortoiz Theme"
post_image: "/assets/images/test-post/test-post.jpg"
post_format: "general"
trending: true
time_to_read: "15 min"
permalink: /blogs/:title
---

<h1>{{page.title}}</h1>
<p>With my prior blog post about using Enclave to control your homelab servers, I made a passing mention to Cockpit. Now I’ll be honest I’d not heard about Cockpit until I started looking into moving my home media server over to Linux (I use Fedora Server). With some investigation it seemed that Cockpit was near enough perfect for what I wanted to do: manage my Linux server’s local storage and updates from a slick UI. Not to mention error logging!</p>

<p>For those who don’t know, Cockpit is web-based a management portal for Linux servers, developed in conjunction with RedHat Linux. It’s incredibly powerful; letting you manage near enough everything about the server through a web portal, and if you can’t do it through the web portal, Cockpit gives you access to a terminal in the browser too, so no need to SSH into your box. Oh and obviously given the topic of this blog post there are plug-ins! </p>

<h2>So… plug-ins?</h2> 
<p> Knowing Cockpit supports plug-ins, my first question was: how do I make one for Enclave? To my surprise it was fairly simple. All you need is a manifest.json file, an index.html file and an index.js file. That’s it. You now have a plug-in.</p>

<p>Well not quite, you need do some supporting code, but that’s the overall structure. To use your newly created plug-in you’ll need to place the files in /home/[username]/.local/share/cockpit/[pluginName]. Now that’s done, refreshing the Cockpit UI in the browser will show your newly created plug-in on the left-hand menu.</p>

<p>Psst we’ve made <a href="#">it open source you can find it here! </a> </p>

<h3>How does the plug-in work?</h3>

<p>The main functionality of the Enclave plug-in for Cockpit is based on the Enclave command-line interface. Enclave offers a --json modifier for most CLI commands, so I’ve made the plug-in call enclave status --json to get a structured document representing the status of the Enclave agent.</p>

<blockquote class="blockquote single-quote">
  <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo non labore totam tempora sed neque repellat numquam eaque inventore! Iusto saepe ipsum, ex, commodi asperiores iure dolores amet dolorem eos voluptatum, aliquid incidunt non perferendis earum dignissimos quod iste accusantium deleniti.Risus sociis urna elementum ultricies justo quisque, mattis in eros facilisis mauris vestibulum sed, luctus proin nibh nonummy integer, nullam sit eget cum duis. Et sodales blandit, libero pede suscipit, tincidunt amet </p>
</blockquote>
<h4>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h4>
<p>eleifend hac porta faucibus aliquam eros, massa facilisis, sed pede maecenas porttitor id magnis. Ac sed aliquam in felis amet, adipiscing pede a amet faucibus sit, quis in et ullamcorper vel commodo. Volutpat ut pede sem ipsum non, sapien adipiscing, suspendisse neque, quis dolor donec dolor. Sit voluptatibus, scelerisque in semper lacus nostra, ac integer dolor mauris tempus eget</p>

Accumsan augue ullamcorper eros viverra neque, libero est metus libero. Lacinia wisi feugiat tellus neque dui pellentesque, libero Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit est velit similique laborum, cumque aliquam porro dicta debitis repellat, tempore dignissimos, neque ab fuga voluptatibus. Earum numquam repellat sed perspiciatis ratione explicabo, odit! Repellendus voluptatibus nemo praesentium

<b>augue ullamcorper eros viverra neque, libero est metus libero. Lacinia wisi feugiat tellus neque dui pellentesque, libero Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit est velit similique laborum, cumque aliquam porro dicta debitis repellat, tempore dignissimos, neque ab fuga voluptatibus. Earum numquam repellat sed perspiciatis ratione explicabo, odit! Repellendus voluptatibus nemo praesentiumaugue ullamcorper eros viverra neque, libero est metus libero. Lacinia wisi feugiat tellus neque dui pellentesque, libero Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit est velit similique laborum, cumque aliquam porro dicta debitis repellat, tempore dignissimos, neque ab fuga voluptatibus. Earum numquam repellat sed perspiciatis ratione explicabo, odit! Repellendus voluptatibus nemo praesentium! </b>
