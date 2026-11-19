# Create all required directories for Cartoon Studio AI
$base = "D:\Linux-Transfer\Code\Cartoon Studio AI"

# Main directories
@("frontend","backend","database","storage","assets","projects","renders","exports","docs","prompts","tests") | ForEach-Object {
    New-Item -ItemType Directory -Path "$base\$_" -Force | Out-Null
}

# Asset subdirectories
@("characters","backgrounds","voices","effects","music") | ForEach-Object {
    New-Item -ItemType Directory -Path "$base\assets\$_" -Force | Out-Null
}

# Frontend subdirectories
@("app","components","lib","hooks","store","types","utils","styles") | ForEach-Object {
    New-Item -ItemType Directory -Path "$base\frontend\$_" -Force | Out-Null
}

# Backend subdirectories
@("app","api","core","models","schemas","services","workers") | ForEach-Object {
    New-Item -ItemType Directory -Path "$base\backend\$_" -Force | Out-Null
}

# Backend API v1 subdirectories
@("endpoints") | ForEach-Object {
    New-Item -ItemType Directory -Path "$base\backend\api\v1\$_" -Force | Out-Null
}

# Database subdirectories
New-Item -ItemType Directory -Path "$base\database\migrations" -Force | Out-Null
New-Item -ItemType Directory -Path "$base\database\seeds" -Force | Out-Null

Write-Host "All directories created successfully!"