#!/usr/bin/env python3
"""
Generate a stylish icon with "Phrased" text for the Chrome extension.
This icon will be used in the extension toolbar and Chrome Web Store.
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_phrased_icon(size=128):
    """Create a stylish Phrased icon with text."""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Colors
    orange = (255, 140, 66, 255)  # #ff8c42
    white = (255, 255, 255, 255)
    dark_bg = (15, 15, 30, 200)  # #0f0f1e with some transparency

    # Draw rounded rectangle background (with white border for pop)
    padding = int(size * 0.08)
    radius = int(size * 0.15)

    # Outer white border for contrast
    border_width = max(1, int(size * 0.03))
    for i in range(border_width):
        draw.rounded_rectangle(
            [(padding - i, padding - i), (size - padding + i, size - padding + i)],
            radius=radius,
            outline=white,
            width=1
        )

    # Main background with subtle gradient effect (dark with orange tint)
    draw.rounded_rectangle(
        [(padding, padding), (size - padding, size - padding)],
        radius=radius,
        fill=dark_bg
    )

    # Draw speech bubble outline (large, takes up most of icon)
    bubble_padding = int(size * 0.18)
    bubble_x1 = bubble_padding
    bubble_y1 = bubble_padding
    bubble_x2 = size - bubble_padding
    bubble_y2 = int(size * 0.65)

    # Draw rounded rectangle for speech bubble
    bubble_radius = int(size * 0.08)
    draw.rounded_rectangle(
        [(bubble_x1, bubble_y1), (bubble_x2, bubble_y2)],
        radius=bubble_radius,
        outline=orange,
        width=max(1, int(size * 0.05))
    )

    # Draw pointer for speech bubble (bottom-left)
    pointer_x = int(size * 0.28)
    pointer_y = bubble_y2
    pointer_tip_x = int(size * 0.2)
    pointer_tip_y = int(size * 0.8)
    pointer_right_x = int(size * 0.36)

    points = [
        (pointer_x, pointer_y),
        (pointer_tip_x, pointer_tip_y),
        (pointer_right_x, pointer_y)
    ]
    draw.polygon(points, fill=orange)

    # Draw horizontal lines inside bubble (representing text/prompts)
    line_start_x = bubble_x1 + int(size * 0.1)
    line_y1 = bubble_y1 + int(size * 0.08)
    line_y2 = line_y1 + int(size * 0.15)
    line_y3 = line_y2 + int(size * 0.15)

    line_width = max(1, int(size * 0.04))

    # Line 1 (full width)
    draw.line(
        [(line_start_x, line_y1), (bubble_x2 - int(size * 0.08), line_y1)],
        fill=orange,
        width=line_width
    )

    # Line 2 (medium)
    draw.line(
        [(line_start_x, line_y2), (bubble_x2 - int(size * 0.15), line_y2)],
        fill=orange,
        width=line_width
    )

    # Line 3 (shorter)
    draw.line(
        [(line_start_x, line_y3), (bubble_x2 - int(size * 0.25), line_y3)],
        fill=orange,
        width=line_width
    )

    # Add accent dot in top-right of bubble
    dot_x = bubble_x2 - int(size * 0.1)
    dot_y = bubble_y1 + int(size * 0.08)
    dot_size = int(size * 0.05)
    draw.ellipse(
        [(dot_x - dot_size, dot_y - dot_size), (dot_x + dot_size, dot_y + dot_size)],
        fill=orange
    )

    return img

def create_icon_with_text(size=128):
    """Create icon with 'Phrased' text overlay."""
    img = create_phrased_icon(size)
    draw = ImageDraw.Draw(img)

    # Try to use a nice system font, fallback to default
    try:
        # Determine font size based on icon size
        font_size = int(size * 0.18)
        # Try common system font paths on Windows
        font_paths = [
            'C:\\Windows\\Fonts\\segoeui.ttf',
            'C:\\Windows\\Fonts\\arial.ttf',
        ]
        font = None
        for path in font_paths:
            if os.path.exists(path):
                font = ImageFont.truetype(path, font_size)
                break
        if not font:
            font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()

    # Draw "Phrased" text at the bottom
    text = "Phrased"
    orange = (255, 140, 66, 255)

    # Get text bounding box to center it
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Position text at bottom center
    text_x = (size - text_width) // 2
    text_y = int(size * 0.68)

    # Draw text with slight outline for better visibility
    outline_width = 1
    for adj_x in range(-outline_width, outline_width + 1):
        for adj_y in range(-outline_width, outline_width + 1):
            if adj_x != 0 or adj_y != 0:
                draw.text(
                    (text_x + adj_x, text_y + adj_y),
                    text,
                    font=font,
                    fill=(15, 15, 30, 200)
                )

    # Draw main text in orange
    draw.text((text_x, text_y), text, font=font, fill=orange)

    return img

def generate_all_sizes():
    """Generate icons at all required sizes."""
    sizes = {
        'assets/icon.png': 128,  # Main icon (replaces old one)
        'src/icon16.png': 16,
        'src/icon32.png': 32,
        'src/icon48.png': 48,
        'src/icon64.png': 64,
        'src/icon128.png': 128,
    }

    for path, size in sizes.items():
        print(f"Generating {path} ({size}x{size})...")
        img = create_icon_with_text(size)

        # Ensure directory exists
        directory = os.path.dirname(path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory)

        img.save(path, 'PNG')
        print(f"  Saved {path}")

    print("\nAll icons generated successfully!")
    print("Updated:")
    print("  - assets/icon.png (main icon for toolbar)")
    print("  - src/icon*.png (all sizes for extension)")

if __name__ == '__main__':
    generate_all_sizes()
