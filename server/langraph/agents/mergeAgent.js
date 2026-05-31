export async function mergeAgent(state) {
  return {
    finalCode: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
${state.css}
</style>

<title>Generated Website</title>
</head>

<body>

${state.html}

<script>
${state.js}
</script>

</body>
</html>
`,
  };
}