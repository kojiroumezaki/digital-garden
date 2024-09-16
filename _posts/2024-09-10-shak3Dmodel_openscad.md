---
layout: post
title: "尺八 3D Model Code: OpenSCAD"
date: 2024-09-10
image: "./assets/images/shakuhachi.png"
group: "shakuhachiresearch"
---

{% for post in site.posts %}
  {% if post.title == "尺八 3D Model Code: STL Viewer" %}
<a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  {% endif %}
{% endfor %}

Shak_02.scad
```OpenSCAD
include <Shak_Experiment_Header_00.scad>
use <Bend_Experiment_00.scad>
use <Shak_Experiment_00.scad>
use <CurvedUtaguchi.scad>

hole_r_A = 5.5;
hole_r_B = 5.0;
tube_h = 18/33*1000;
top_h = 288.0;
//bottom_h = 257.4;
bottom_h = tube_h-top_h;
inner_cyl_h = 16.0;
inner_cyl_w = 4.0;
tube_r = 16.0;
hole_x_off = tube_r/2;
extra = 0.0;

module shak_all()
{
    module main_cylinder()
    {
        union()
        {
            // main cylinder
            cylinder(r = tube_r, h = tube_h, center = false);
            
            // curved utaguchi
            translate([0,0,tube_h-uta_y()])
            uta_main();
        }
    }
    
    module rotcy(r)
    {
        rotate(90, [0,1,0]) { cylinder(r = r, h = hole_x_off*2+extra, center = true); }
    }
    
    module fingerholes()
    {
        hole_4_v = 9.4/33*1000;
        hole_3_v = hole_4_v - 1.8/33*1000;
        hole_2_v = hole_3_v - 1.8/33*1000;
        hole_1_v = hole_2_v - 1.8/33*1000;
        hole_5_v = hole_4_v + 1.2/33*1000;

        // finger holes
        translate([hole_x_off,0,hole_1_v]) { rotcy(hole_r_A); }
        translate([hole_x_off,0,hole_2_v]) { rotcy(hole_r_A); }
        translate([hole_x_off,0,hole_3_v]) { rotcy(hole_r_B); }
        translate([hole_x_off,0,hole_4_v]) { rotcy(hole_r_A); }
        translate([-hole_x_off,0,hole_5_v]) { rotcy(hole_r_A); }
    }
    
    taper_bot_h = bend_tube_length;
    inner_rad_top = 10;
    inner_rad_mid = 14.5/2;
    inner_rad_bot = 9;

    module inner_bore_upper_taper()
    {
        translate([0,0,-extra+taper_bot_h])
            cylinder(r1 = inner_rad_mid, r2 = inner_rad_top,
                    h = tube_h-taper_bot_h+(extra*2), center = false);
    }

    module inner_bore_lower_taper()
    {
        translate([0,0,-extra])
            cylinder(r1 = inner_rad_bot, r2 = inner_rad_mid,
                    h = taper_bot_h+(extra), center = false);
    }

    difference()
    {
        main_cylinder();
        
        union()
        {
            inner_bore_upper_taper();
            inner_bore_lower_taper();
        }
        
        utaguchi_cut_front();
        utaguchi_cut_back();

        fingerholes();
    }
}

module outer_ring(r_offset)
{
    cyl_h = inner_cyl_h;
    difference()
    {
        // render solid
        cylinder(r = tube_r, h = cyl_h, center = false);
        
        // remove inner portion
        translate([0,0,0])
        {
            cylinder(r = tube_r-inner_cyl_w+r_offset, h = cyl_h, center = false);
        }
    }
}

module outer_ring_deprecated(r_offset, remove)
{
    cyl_h = inner_cyl_h + (remove ? extra : 0.);
    difference()
    {
        // render solid
        cylinder(r = tube_r + (remove ? extra : 0.), h = cyl_h, center = false);
        
        // remove inner portion
        translate([0,0,(remove ? 0 : -extra)])
        {
            cylinder(r = tube_r-inner_cyl_w+r_offset, h = cyl_h + (remove ? 0 : extra*2), center = false);
        }
    }
}

uta_cut_cube_size = 50; // not sure how to calculate the exact dimensions of the cube

module utaguchi_cut_front()
{
//    cut_h = 12.5;
    cut_h = 13.5;
//    cut_angle = 30.0;
    cut_angle = 30.0;
    translate([tube_r,-(uta_cut_cube_size/2),tube_h-cut_h]) {
        rotate(-cut_angle,[0,1,0]) {
            cube(size = uta_cut_cube_size, center = false);
        }
    }
}

module utaguchi_cut_back()
{
    translate([-20,0,tube_h+22.5]) {
        rotate(-6,[0,1,0]) {
            cube(size = uta_cut_cube_size, center = true);
        }
    }
}

module shak_top()
{
    // move top down to origin
    translate([0,0,-bottom_h])
    {
        // combine top MINUS inner cylinder height w/ outer ring
        union()
        {
            difference()
            {
                // render all
                shak_all();
                        
                // take away bottom PLUS inner outer ring height
                translate([0,0,-extra]) {
                    cylinder(r = tube_r+extra, h = bottom_h+inner_cyl_h+extra, center = false);
                }
            }
    
            // add outer ring of inner cylinder
//            translate([0,0,bottom_h]) { outer_ring(0.0, false); }
            translate([0,0,bottom_h]) { outer_ring(0.0); }
        }
    }
}

module shak_bottom()
{
    difference()
    {
        // render all
        shak_all();
        
        // take away top MINUS inner cylinder height
        translate([0,0,bottom_h+inner_cyl_h]) {
            cylinder(r = tube_r+extra+uta_x(), h = top_h-inner_cyl_h+extra+1.0, center = false); // 1.0 added to height as a temporary fix
        }
        
        // take away outer ring of inner cylinder
//        translate([0,0,bottom_h]) { outer_ring(-0.2, true); }
        translate([0,0,bottom_h]) { outer_ring(-(print_microns/1000*1.5)); }
    }
}

module nakatsugi_top()
{
    difference()
    {
        shak_top();

        translate([0,0,inner_cyl_h+5])
                cylinder(r = tube_r+uta_x(), h = top_h-5, center = false);
    }
}

module nakatsugi_bottom()
{
    translate([0,0,-(bottom_h-5)])
        difference()
        {
            shak_bottom();
    
            cylinder(r = tube_r+uta_x(), h = bottom_h-5, center = false);
        }
}

// the following section is for the bent bottom

//module bend(bend_seg_scale)
//{
//    translate([0,0,z_offset()])
//        rotate([0,0,180])
//            bend_main_b(num_bend_segs(bend_seg_scale));
//}

module main_with_bend(all,num_segs)
{
    //mirror([0,0,1])
    //translate([0,0,-(bottom_h+inner_cyl_h)])
    {
        bend_offset = bend_tube_length-z_offset();
        difference()
        {
            if (all)
                shak_all();
            else
                translate([0,0,-bend_offset]) shak_bottom();
        
            translate([0,0,-bend_offset-extra])
                cylinder(r=tube_r+extra*2,h=bend_tube_length);
        
        }

		rotate([0,0,180])
			translate([-torus_radius(),0,z_offset()])
				rotate([90,0,0])
					bend(num_segs,false);
    }
}

module shak_all_bend(num_segs)
{
    main_with_bend(true,num_segs);
}

module shak_bottom_bend(num_segs)
{
    main_with_bend(false,num_segs);
}

shak_all();
//shak_top();
//shak_bottom();

//nakatsugi_top();
//nakatsugi_bottom();

// for final print (make sure to switch $fn to 256)
// num_segs = 15;
// for editing
// num_segs = 2;
//shak_all_bend(num_segs);
//shak_bottom_bend(num_segs);

```

Shak_Experiment_Header_00.scad
```
$fn=256; // make sure this is 256 for final print
print_microns = 100;
bend_tube_length = 90;
bend_arc_angle = 30;
```

Bend_Experiment_00.scad
```
include <Shak_Experiment_Header_00.scad>

function torus_radius() = bend_tube_length / (bend_arc_angle/180*PI);
echo(torus_radius());

radius_start = 9;
radius_end = 7.25;
radius_delta = radius_start - radius_end;

function radius_max() = radius_start;
echo(radius_max());

module torus(radius)
{
    rotate_extrude()
    translate([torus_radius(), 0, 0])
    circle(r=radius);
}

module angle_cut(cut_angle,circle_radius)
{
    translate([0,0,-(torus_radius()+circle_radius)/2])
        rotate([0,0,cut_angle])
            cube(size=(torus_radius()+circle_radius), center=false);
}

module quadrant_cut(t,circle_radius)
{
    translate(t)
        cube(size=torus_radius()+circle_radius, center=true);
}

module bend_bore_solid(num_segs)
{
    difference() {
    
        intersection() {
            for (n = [1:num_segs])
            {
                radius_offset = (n-1)/(num_segs-1)*radius_delta;
                cut_angle = -(num_segs-n)/num_segs*bend_arc_angle;
                echo(n,cut_angle,radius_offset);
                difference()
                {
                    torus(radius_max()-radius_offset);
                    angle_cut(cut_angle,radius_max());
                    if (cut_angle < -90)
                        angle_cut(-90,radius_max());
                }
            }
        }
    
        angle_cut(270-bend_arc_angle,radius_max());
    
        cube_t_length = (torus_radius()+radius_max())/2;
        quadrant_cut([cube_t_length,cube_t_length,0],radius_max());
        quadrant_cut([-cube_t_length,cube_t_length,0],radius_max());
//        quadrant_cut([-cube_t_length,-cube_t_length,0],radius_max());
    }
}

num_segs = 4;
bend_bore_solid(num_segs);
```

Shak_Experiment_00.scad
```
include <Shak_Experiment_Header_00.scad>
use <Bend_Experiment_00.scad>

circle_radius = 16;

function z_offset() = (torus_radius() + circle_radius) * sin(bend_arc_angle>90?90:bend_arc_angle);
echo(z_offset());

module bend(num_segs,bore_only)
{
    difference()
    {
        if (!bore_only)
            torus(circle_radius);

        bend_bore_solid(num_segs);
    
        angle_cut(270-bend_arc_angle,circle_radius);
    
        cube_t_length = (torus_radius()+circle_radius)/2;
        quadrant_cut([cube_t_length,cube_t_length,0],circle_radius);
        quadrant_cut([-cube_t_length,cube_t_length,0],circle_radius);
        if (bend_arc_angle <= 90)
            quadrant_cut([-cube_t_length,-cube_t_length,0],circle_radius);
    }
}

translate([-torus_radius(),0,z_offset()]) rotate([90,0,0]) bend(3,false);
```

CurvedUtaguchi.scad
```
$fn=64;
x = 2.5;
y = 20;
rad_circle = (x*x + y*y) / (2*x);
tube_r = 16;
xy_cube = (rad_circle*2+tube_r)*2;
extra = 0.1;

function uta_x() = x;
function uta_y() = y;

module uta_torus()
{
    rotate_extrude()
        translate([rad_circle+tube_r, 0, 0])
            circle(r=rad_circle);
}

module uta_cut_cube(z)
{
    translate([0,0,z])
        cube([xy_cube,xy_cube,rad_circle], center=true);
}

module uta_cut()
{
    difference()
    {
        uta_torus();
        uta_cut_cube(-rad_circle/2);
    }
}

module uta_main()
{
    difference ()
    {
        translate([0,0,extra])
            cylinder(h = y-extra, r = tube_r+x);
        cylinder(h = y+extra, r = tube_r);
        uta_cut();
    }
}

uta_main();
```
