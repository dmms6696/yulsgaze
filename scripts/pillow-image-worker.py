import json
import sys
from pathlib import Path

from PIL import Image


def metadata(path):
    with Image.open(path) as image:
        return {"width": image.width, "height": image.height}


def crop_box(width, height, target_width, target_height, position):
    source_ratio = width / height
    target_ratio = target_width / target_height

    if source_ratio > target_ratio:
        crop_width = int(round(height * target_ratio))
        crop_height = height
        if position == "left":
            left = 0
        elif position == "right":
            left = width - crop_width
        else:
            left = (width - crop_width) // 2
        top = 0
    else:
        crop_width = width
        crop_height = int(round(width / target_ratio))
        left = 0
        if position == "top":
            top = 0
        elif position == "bottom":
            top = height - crop_height
        else:
            top = (height - crop_height) // 2

    return (left, top, left + crop_width, top + crop_height)


def normalize(path, target_width, target_height, position):
    extension = path.suffix.lower()
    with Image.open(path) as image:
        box = crop_box(image.width, image.height, target_width, target_height, position)
        cropped = image.crop(box)
        resized = cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)

        if extension in {".jpg", ".jpeg"}:
            resized = resized.convert("RGB")
            resized.save(path, quality=92, optimize=True)
        elif extension == ".webp":
            resized.save(path, quality=92, method=6)
        else:
            resized.save(path, optimize=True, compress_level=9)

    return metadata(path)


def main():
    command = sys.argv[1]
    path = Path(sys.argv[2])

    if command == "metadata":
        print(json.dumps(metadata(path)))
        return

    if command == "normalize":
        target_width = int(sys.argv[3])
        target_height = int(sys.argv[4])
        position = sys.argv[5] if len(sys.argv) > 5 else "center"
        print(json.dumps(normalize(path, target_width, target_height, position)))
        return

    raise SystemExit(f"Unknown command: {command}")


if __name__ == "__main__":
    main()
