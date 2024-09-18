---
layout: post
title: "尺八 Physical Model"
date: 2024-09-18
image: "./assets/images/shakuhachi.png"
group: "shakuhachiresearch"
---

```python3
import matplotlib.pyplot as plt
import numpy as np

f = np.arange(0.,1000.,0.5)
L = 0.5454
N = 10
#r = [0.01,0.0145/2,0.009]
#r = [0.01,0.01,0.00]
#r = [0.01,0.00,0.00]
r = [0.01,0.01,0.01]
#X = (L-0.00)/L
X = (L-0.09)/L

print(L,r,X)

a = r[len(r)-1]
w = 0.005
deltaL = a*(0.821-0.13*np.power(0.42+w/a,-0.54))

d = 1.204
c = 343.

print("D4 {}Hz".format(440*np.power(2,(-7/12))))
print("L {}Hz".format(c/(2*L)))
print("L+deltaL {}Hz".format(c/(2*(L+deltaL))))

def interp_lin(x,y0,y1):
    return (y1-y0)*x+y0
    
def calc_r(x):
    r0 = r[0]
    r1 = r[1]
    if (x > X):
        x = (x-X)/(1.-X)
        r0 = r[1]
        r1 = r[2]
    return interp_lin(x,r0,r1)

def calc_theta(f,L):
    omega = 2 * np.pi * f
    k = omega / c
    return -2. * k * L

def calc_z0(r):
    S = np.pi * r * r
    return d * c / S + 0j

def calc_zin(theta,z0,zl):
    z = (zl-z0)/(zl+z0)
    R = np.exp(1j * theta) * z
    return z0*((1+R)/(1-R))

def calc(f,L,r,zl):
    theta = calc_theta(f,L)
    z0 = calc_z0(r)
    return calc_zin(theta,z0,zl)


sections = []
for n in range(N):
    sections.append([L/N,(calc_r(n/N)+calc_r((n+1)/N))/2])
print(sections)

zl = 0. + 0j
for n in range(len(sections)):
    L = sections[n][0]
    r = sections[n][1]
    zin = calc(f,L,r,zl)
    zl = zin
zinmag = np.absolute(zin)
zinlog = np.log10(zinmag)

minima = []
maxima = []
deltaprev = 0.
for n in range(1,len(zinlog)):
    delta = zinlog[n]-zinlog[n-1]
    if (deltaprev != 0 and delta*deltaprev <= 0):
        frange = [f[n-1],f[n]]
        if (deltaprev < 0):
            minima.append(frange)
        else:
            maxima.append(frange)
    deltaprev = delta
print(minima,maxima)

x = f
y = zinlog

plt.plot(x, y)
plt.ylabel('zin')
plt.xlabel('freq (Hz)')

plt.show()
```
