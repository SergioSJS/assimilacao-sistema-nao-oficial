import re

# 1. FIX DATA MODEL
with open('module/data/actor-infectado.mjs', 'r') as f:
    data = f.read()
data = data.replace('veiculos:     new fields.NumberField({ integer: true, min: 0, max: 5, initial: 0, required: true }),\n', '')
with open('module/data/actor-infectado.mjs', 'w') as f:
    f.write(data)

# 2. FIX CSS
with open('styles/assimilacao.css', 'r') as f:
    css = f.read()

# Proportions
css = css.replace('.infectado .grid-2col {\n    display: grid;\n    grid-template-columns: 1fr 1fr;', '.infectado .grid-2col {\n    display: grid;\n    grid-template-columns: 1fr 1fr;')
# Actually SASS compiled grid-2col a bit statically. Let's add a specific rule for .content-grid
css += "\n.infectado .content-grid { grid-template-columns: 2fr 1fr !important; }\n"

# Font sizes
css += """
.infectado .stat-box label { font-size: 16px !important; }
.infectado .instinto-combinar { font-size: 14px !important; padding: 2px; height: 24px; }
.infectado .grupo-conhecimentos h3, .infectado .grupo-praticas h3 { font-size: 20px !important; }
.infectado .propositos textarea { resize: vertical; min-height: 40px; }
"""
with open('styles/assimilacao.css', 'w') as f:
    f.write(css)

# 3. FIX HBS (HTML)
with open('templates/actors/infectado-sheet.hbs', 'r') as f:
    hbs = f.read()

# REMOVE PROPOSITOS FROM HEADER
propositos_match = re.search(r'(<div class="propositos">.*?</div>)', hbs, re.DOTALL)
if propositos_match:
    prop_html = propositos_match.group(1)
    hbs = hbs.replace(prop_html, '')
    
    # ADD TO VERSO
    verso_insert = '<div class="verso-left">\n                    <h2 class="section-title">Características</h2>'
    new_verso = '<div class="verso-left">\n                    ' + prop_html + '\n                    <h2 class="section-title mt">Características</h2>'
    hbs = hbs.replace(verso_insert, new_verso)
    
    # Change propositos inputs to textareas
    hbs = hbs.replace('<input type="text" name="system.propositos.pessoal1" value="{{system.propositos.pessoal1}}" placeholder="Propósito Pessoal 1"/>', '<textarea name="system.propositos.pessoal1" placeholder="Propósito Pessoal 1">{{system.propositos.pessoal1}}</textarea>')
    hbs = hbs.replace('<input type="text" name="system.propositos.pessoal2" value="{{system.propositos.pessoal2}}" placeholder="Propósito Pessoal 2"/>', '<textarea name="system.propositos.pessoal2" placeholder="Propósito Pessoal 2">{{system.propositos.pessoal2}}</textarea>')
    hbs = hbs.replace('<input type="text" name="system.propositos.relacional1" value="{{system.propositos.relacional1}}" placeholder="Propósito Coletivo 1"/>', '<textarea name="system.propositos.relacional1" placeholder="Propósito Coletivo 1">{{system.propositos.relacional1}}</textarea>')

# CABO DE GUERRA STYLE FIX (remove black background)
hbs = hbs.replace('background: rgb(17, 17, 17); padding: 20px; border: 1px solid rgb(51, 51, 51);', 'padding: 20px;')
# Change Cabo de Guerra title color
hbs = hbs.replace('color: rgb(204, 204, 204);', '')
hbs = hbs.replace('background: rgb(8, 8, 8);', '')

# ADD TOOLTIPS TO HEALTH
# We can't do logic easily inside the loop without Handlebars helpers. 
# But we can inject a script to map titles, or add explicit if/else conditions.
# Instead, the tooltips can just be static text strings attached via Javascript or mapped in JS.

with open('templates/actors/infectado-sheet.hbs', 'w') as f:
    f.write(hbs)

