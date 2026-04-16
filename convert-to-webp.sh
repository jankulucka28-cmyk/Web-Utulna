#!/bin/bash

# =====================================================
# Skript pro konverzi obrázků do WebP formátu
# =====================================================
#
# INSTALACE NÁSTROJE (Mac):
# brew install webp
#
# POUŽITÍ:
# chmod +x convert-to-webp.sh
# ./convert-to-webp.sh
#
# =====================================================

echo "🖼️  Konverze obrázků do WebP formátu..."
echo ""

# Kontrola, jestli je nainstalován cwebp
if ! command -v cwebp &> /dev/null; then
    echo "❌ Chyba: cwebp není nainstalován!"
    echo ""
    echo "Pro instalaci na macOS použij:"
    echo "  brew install webp"
    echo ""
    echo "Pro instalaci na Ubuntu/Debian:"
    echo "  sudo apt-get install webp"
    echo ""
    exit 1
fi

# Přejdi do složky s obrázky
cd "Obrazky" || exit 1

# Počítadla
total=0
converted=0
skipped=0

# Najdi všechny JPEG a PNG obrázky
for img in *.{jpg,jpeg,png,JPG,JPEG,PNG}; do
    # Kontrola, jestli soubor existuje (kvůli glob patternu)
    [ -f "$img" ] || continue

    total=$((total + 1))

    # Získej jméno bez přípony
    filename="${img%.*}"

    # Cílový WebP soubor
    webp_file="${filename}.webp"

    # Přeskoč, pokud WebP už existuje
    if [ -f "$webp_file" ]; then
        echo "⏭️  Přeskakuji: $img (WebP už existuje)"
        skipped=$((skipped + 1))
        continue
    fi

    echo "🔄 Konvertuji: $img"

    # Konverze do WebP
    # -q 85 = kvalita 85% (dobrý poměr kvalita/velikost)
    # -m 6 = nejlepší komprese (nejpomalejší, ale nejmenší soubor)
    cwebp -q 85 -m 6 "$img" -o "$webp_file"

    if [ $? -eq 0 ]; then
        # Porovnej velikosti
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)

        if [ -n "$original_size" ] && [ -n "$webp_size" ]; then
            saved=$((original_size - webp_size))
            percent=$((saved * 100 / original_size))

            echo "   ✅ Hotovo! Ušetřeno: ${percent}% ($(numfmt --to=iec-i --suffix=B $saved 2>/dev/null || echo "$saved bytes"))"
        else
            echo "   ✅ Hotovo!"
        fi

        converted=$((converted + 1))
    else
        echo "   ❌ Chyba při konverzi!"
    fi

    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Shrnutí:"
echo "   Celkem obrázků: $total"
echo "   Zkonvertováno: $converted"
echo "   Přeskočeno: $skipped"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $converted -gt 0 ]; then
    echo "✨ Konverze dokončena!"
    echo ""
    echo "📝 Další kroky:"
    echo "   1. WebP obrázky byly vytvořeny vedle originálů"
    echo "   2. .htaccess automaticky použije WebP pro podporované prohlížeče"
    echo "   3. Originální obrázky zůstávají jako fallback"
    echo ""
else
    echo "ℹ️  Žádné nové obrázky ke konverzi."
fi
