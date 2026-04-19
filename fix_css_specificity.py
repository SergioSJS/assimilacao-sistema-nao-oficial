import re
with open('styles/assimilacao-v2.css', 'r') as f:
    css = f.read()

# Replace .infectado back with a highly specific chain!
css = css.replace('.infectado ', '.app.window-app.assimilacao.sheet.actor.infectado ')
css = css.replace('.infectado{', '.app.window-app.assimilacao.sheet.actor.infectado{')

with open('styles/assimilacao-v2.css', 'w') as f:
    f.write(css)
