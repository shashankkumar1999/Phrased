#!/usr/bin/env python3
"""
Generate icon PNG files from SVG logo for Phrased extension.
Supports sizes: 16, 32, 48, 64, 128
"""

import os
from PIL import Image, ImageDraw

def create_logo_icon(size):
    """Create a logo icon at the specified size."""
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale values based on size
    padding = int(size * 0.12)
    line_width = max(1, int(size * 0.08))

    # Orange color (#ff8c42)
    orange = (255, 140, 66, 255)
    orange_light = (255, 165, 0, 255)

    # Draw speech bubble background circle (very subtle)
    bubble_pad = padding
    draw.ellipse(
        [(bubble_pad, bubble_pad), (size - bubble_pad, size - bubble_pad)],
        outline=orange,
        width=max(1, int(line_width * 0.5)),
    )

    # Draw speech bubble (main shape)
    bubble_x1 = padding + int(size * 0.05)
    bubble_y1 = padding
    bubble_x2 = size - padding - int(size * 0.05)
    bubble_y2 = size - padding - int(size * 0.15)

    # Create bubble outline (simplified rounded rectangle)
    points = [
        (bubble_x1 + int(size * 0.08), bubble_y1),  # top-left curve start
        (bubble_x2 - int(size * 0.08), bubble_y1),  # top-right curve start
        (bubble_x2, bubble_y1 + int(size * 0.08)),  # top-right
        (bubble_x2, bubble_y2 - int(size * 0.08)),  # right side
        (bubble_x2 - int(size * 0.08), bubble_y2),  # bottom-right
        (int(size * 0.35), bubble_y2),              # bottom-left of pointer
        (int(size * 0.28), size - padding),         # pointer tip
        (int(size * 0.2), bubble_y2),               # pointer left
        (bubble_x1 + int(size * 0.08), bubble_y1),  # back to top
    ]

    # Draw the bubble with a polygon approximation
    draw.polygon(points, outline=orange, width=0)
    draw.line([(bubble_x1, bubble_y1 + int(size * 0.08)), (bubble_x1, bubble_y2)],
              fill=orange, width=line_width)
    draw.line([(bubble_x1 + int(size * 0.08), bubble_y1), (bubble_x2 - int(size * 0.08), bubble_y1)],
              fill=orange, width=line_width)
    draw.line([(bubble_x2, bubble_y1 + int(size * 0.08)), (bubble_x2, bubble_y2 - int(size * 0.08))],
              fill=orange, width=line_width)
    draw.line([(bubble_x2 - int(size * 0.08), bubble_y2), (int(size * 0.35), bubble_y2)],
              fill=orange, width=line_width)

    # Draw pointer
    draw.polygon([
        (int(size * 0.35), bubble_y2),
        (int(size * 0.28), size - padding),
        (int(size * 0.2), bubble_y2)
    ], fill=orange)

    # Draw horizontal lines (representing prompts/text)
    line_spacing = int((bubble_y2 - bubble_y1 - int(size * 0.2)) / 3.5)
    line_start = bubble_x1 + int(size * 0.15)
    line_y_start = bubble_y1 + int(size * 0.2)

    # Line 1
    line_end_1 = bubble_x2 - int(size * 0.1)
    draw.line([(line_start, line_y_start), (line_end_1, line_y_start)],
              fill=orange, width=max(1, int(line_width * 0.6)))

    # Line 2
    line_end_2 = bubble_x2 - int(size * 0.18)
    draw.line([(line_start, line_y_start + line_spacing), (line_end_2, line_y_start + line_spacing)],
              fill=orange, width=max(1, int(line_width * 0.6)))

    # Line 3
    line_end_3 = bubble_x2 - int(size * 0.25)
    draw.line([(line_start, line_y_start + line_spacing * 2), (line_end_3, line_y_start + line_spacing * 2)],
              fill=orange, width=max(1, int(line_width * 0.6)))

    # Draw accent dot
    dot_x = bubble_x2 - int(size * 0.12)
    dot_y = bubble_y1 + int(size * 0.12)
    dot_radius = max(1, int(size * 0.08))
    draw.ellipse([(dot_x - dot_radius, dot_y - dot_radius),
                  (dot_x + dot_radius, dot_y + dot_radius)],
                 fill=orange)

    return img

def generate_all_icons():
    """Generate icon PNG files for all sizes."""
    sizes = [16, 32, 48, 64, 128]
    output_dir = 'src'

    for size in sizes:
        print(f"Generating icon for size {size}x{size}...")
        img = create_logo_icon(size)

        # Save the icon
        filename = f'{output_dir}/icon{size}.png'
        img.save(filename, 'PNG')
        print(f"Saved {filename}")

    print("\nAll icons generated successfully!")
    print("Icons created:")
    for size in sizes:
        print(f"  - icon{size}.png ({size}x{size})")

if __name__ == '__main__':
    generate_all_icons()
