Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class RtlIconGenerator
{
    public static void CreateIcon(int size, string outputPath)
    {
        using (var bmp = new Bitmap(size, size))
        using (var g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;

            // Background: Dark squircle #0f172a
            float pad = size * 0.04f;
            float arcSize = size * 0.28f;
            float w = size - (pad * 2f);
            float h = size - (pad * 2f);

            using (var path = new GraphicsPath())
            {
                path.AddArc(pad, pad, arcSize, arcSize, 180, 90);
                path.AddArc(pad + w - arcSize, pad, arcSize, arcSize, 270, 90);
                path.AddArc(pad + w - arcSize, pad + h - arcSize, arcSize, arcSize, 0, 90);
                path.AddArc(pad, pad + h - arcSize, arcSize, arcSize, 90, 90);
                path.CloseFigure();

                using (var bgBrush = new SolidBrush(Color.FromArgb(15, 23, 42)))
                {
                    g.FillPath(bgBrush, path);
                }
            }

            // Draw Minimal RTL Direction Symbol (Left Arrow + Alignment Bars)
            // Left primary arrow (Cyan #38bdf8)
            float penWidth = Math.Max(1.5f, size * 0.085f);
            using (var cyanPen = new Pen(Color.FromArgb(56, 189, 248), penWidth))
            {
                cyanPen.StartCap = LineCap.Round;
                cyanPen.EndCap = LineCap.Round;
                cyanPen.LineJoin = LineJoin.Round;

                // Main Arrow pointing left (RTL direction)
                float yMid = size * 0.38f;
                float xStart = size * 0.76f;
                float xEnd = size * 0.24f;
                g.DrawLine(cyanPen, xStart, yMid, xEnd, yMid);

                // Arrow head
                float headSize = size * 0.18f;
                g.DrawLine(cyanPen, xEnd, yMid, xEnd + headSize, yMid - headSize);
                g.DrawLine(cyanPen, xEnd, yMid, xEnd + headSize, yMid + headSize);
            }

            // 3 Right-aligned text lines below (White/Slate #f8fafc and #94a3b8)
            using (var slatePen = new Pen(Color.FromArgb(248, 250, 252), Math.Max(1.2f, size * 0.07f)))
            using (var mutedPen = new Pen(Color.FromArgb(148, 163, 184), Math.Max(1.0f, size * 0.06f)))
            {
                slatePen.StartCap = LineCap.Round;
                slatePen.EndCap = LineCap.Round;
                mutedPen.StartCap = LineCap.Round;
                mutedPen.EndCap = LineCap.Round;

                float lineRight = size * 0.78f;
                
                // Top line (long)
                g.DrawLine(slatePen, lineRight - (size * 0.52f), size * 0.62f, lineRight, size * 0.62f);
                
                // Bottom line (shorter, right-aligned)
                g.DrawLine(mutedPen, lineRight - (size * 0.32f), size * 0.78f, lineRight, size * 0.78f);
            }

            bmp.Save(outputPath, ImageFormat.Png);
        }
    }
}
"@ -ReferencedAssemblies System.Drawing

$iconDir = "C:\Users\gokoq\trachprojs\rtl_ext\icons"
if (!(Test-Path $iconDir)) {
    New-Item -ItemType Directory -Path $iconDir | Out-Null
}

[RtlIconGenerator]::CreateIcon(16, (Join-Path $iconDir "icon16.png"))
[RtlIconGenerator]::CreateIcon(32, (Join-Path $iconDir "icon32.png"))
[RtlIconGenerator]::CreateIcon(48, (Join-Path $iconDir "icon48.png"))
[RtlIconGenerator]::CreateIcon(128, (Join-Path $iconDir "icon128.png"))
Write-Output "RTL icons generated successfully!"
