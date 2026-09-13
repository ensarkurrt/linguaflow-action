# LinguaFlow GitHub Action

CLI kurulumu yapmadan `.linguaconfig` üzerinden çevirileri indirir, doğrular ve type-safe anahtarları üretir.

```yaml
- uses: linguaflow/action@v1
  with:
    command: sync
    working-directory: apps/mobile
```

Management işlemleri için yalnız gereken workflow'a branch-grant'li key verin:

```yaml
- uses: linguaflow/action@v1
  with:
    command: publish
    management-key: ${{ secrets.LINGUAFLOW_MANAGEMENT_KEY }}
    arguments: |
      --message
      Release from CI
      --strategy
      reject
```

`arguments` her satırı tek argüman kabul eder ve shell üzerinden çalıştırılmaz. Action, management key'i log maskesine ekler. Pull/sync için `.linguaconfig` içindeki public branch key yeterlidir.
