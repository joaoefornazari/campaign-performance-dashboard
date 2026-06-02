<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Platform;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CampaignDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_platforms_table_has_expected_columns(): void
    {
        $columns = Schema::getColumnListing('platforms');

        $this->assertContains('id', $columns);
        $this->assertContains('name', $columns);
        $this->assertContains('created_at', $columns);
        $this->assertContains('updated_at', $columns);
    }

    public function test_campaigns_table_has_expected_columns(): void
    {
        $columns = Schema::getColumnListing('campaigns');

        $this->assertContains('id', $columns);
        $this->assertContains('name', $columns);
        $this->assertContains('spend', $columns);
        $this->assertContains('revenue', $columns);
        $this->assertContains('conversions', $columns);
        $this->assertContains('platform_id', $columns);
        $this->assertContains('created_at', $columns);
        $this->assertContains('updated_at', $columns);
    }

    public function test_campaign_foreign_key_references_platform(): void
    {
        $platform = Platform::factory()->create();
        $campaign = Campaign::factory()->create(['platform_id' => $platform->id]);

        $this->assertEquals($platform->id, $campaign->platform_id);

        $this->expectException(\Illuminate\Database\QueryException::class);
        Campaign::factory()->create(['platform_id' => 99999]);
    }

    public function test_name_min_length_check_on_campaigns(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            $this->markTestSkipped('CHECK constraints only enforced on PostgreSQL');
        }

        $platform = Platform::factory()->create();

        $this->expectException(\Illuminate\Database\QueryException::class);
        Campaign::create([
            'name' => 'Short',
            'spend' => 100,
            'revenue' => 200,
            'conversions' => 5,
            'platform_id' => $platform->id,
        ]);
    }

    public function test_spend_non_negative_check(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            $this->markTestSkipped('CHECK constraints only enforced on PostgreSQL');
        }

        $platform = Platform::factory()->create();

        $this->expectException(\Illuminate\Database\QueryException::class);
        Campaign::create([
            'name' => 'Valid Campaign',
            'spend' => -50,
            'revenue' => 200,
            'conversions' => 5,
            'platform_id' => $platform->id,
        ]);
    }
}
