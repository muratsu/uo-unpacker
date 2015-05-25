
## Miscellaneous Information

For the rest of this documentation, we will treat the following types as described:

* CHAR : 8-bit unsigned character
* BYTE : 8-bit signed value (-128..127)
* UBYTE : 8-bit unsigned value (0..255)
* WORD : 16-bit signed value (-32768..32767)
* UWORD : 16-bit unsigned value (0..65535)
* DWORD : 32-bit signed value (-2147483648..2147483647)

Ultima Online is completely 16-bit based -- meaning each pixel is an UWORD value that can be broken down as follows:

URRRRRGGGGGBBBBB

*U=Unused, R=Red, G=Green, B=Blue

To convert to 32-bit:

```
Color32 = ( (((Color16 >> 10) & 0x1F) * 0xFF / 0x1F) |
((((Color16 >> 5) & 0x1F) * 0xFF / 0x1F) << 8) |
((( Color16 & 0x1F) * 0xFF / 0x1F) << 16));
```

## File Contents

## Definitions
### Anim.idx
This file contains an index into ANIM.MUL. To load a specific group of frames from ANIM.MUL, simply seek BNum * 12, read in the index record and use Lookup to find the group within ANIM.MUL.

Index Record (12 bytes)

|0 - 3|4 - 7|8 - B|
|:-|:-|:-|
| Lookup | Size | Unknown |

- DWORD Lookup - Is either undefined ($FFFFFFFF -1) or the file offset in ANIM.MUL
- DWORD Size - Size of the art tile
- DWORD Unknown - Unknown

### ANIM.MUL

Contains the raw animation data. It can be accessed using ANIM.IDX: 

- AnimationGroup
- WORD[256] Palette
- DWORD FrameCount
- DWORD[FrameCount] FrameOffset

**Frame**

Seek from the end of Palette plus FrameOffset[FrameNum] bytes to find the start of Frame: 

- WORD ImageCenterX
- WORD ImageCenterY
- WORD Width
- WORD Height
- data stream

**data stream:**

```
// Note: Set CenterY and CenterY to the vertical and horizontal position in
//       the bitmap at which you want the anim to be drawn.
		
PrevLineNum = $FF
Y = CenterY - ImageCenterY - Height
while not EOF
{
  Read UWORD RowHeader
  Read UWORD RowOfs
  
  if (RowHeader = 0x7FFF) or (RowOfs = 0x7FFF) then Exit
  
  RunLength = RowHeader and $FFF
  LineNum = RowHeader shr 12
  Unknown = RowOfs and $3F
  RowOfs = RowOfs sar 6
  X = CenterX + RowOfs
  if (PrevLineNum <> $FF) and (LineNum <> PrevLineNum) then Y++
  PrevLineNum = LineNum
  if Y >= 0 then
  {
    if Y >= MaxHeight then Exit;
  
    For I := 0 to RunLength-1 do 
    {
      Read(B, 1)
      Row[X+I,Y] = Palette[B]
    }
  }
  Seek(RunLength, FromCurrent)
}
```

### ARTIDX.MUL
### ART.MUL
### GUMPART.MUL
### GUMPIDX.MUL
### HUES.MUL
### MAP0.MUL
### MULTI.IDX
### MULTI.MUL
### PALETTE.MUL
### RADARCOL.MUL
### SKILLS.IDX
### SKILLS.MUL
### SOUND.MUL
### SOUNDIDX.MUL
### STAIDX0.MUL
### STATICS0.MUL
### TILEDATA.MUL
### TEXIDX.MUL
### TEXMAPS.MUL
### VERDATA.MUL

## Credits
Most of the file formats are reverse engineered by great UO Community members. They deserve a special thank you.

anim.mul, anim.idx, art.mul, artidx.mul, palette.mul, texmaps.mul, texidx.mul, tiledata.mul, gumpidx.mul, gumpart.mul, hues.mul by Alazane

map0, radarcol, staidx0, statics0 by Tim Walters

skills.idx, skills.mul by Sir Valgriz

soundidx, sound by Steve Dang

verdata by Cironian