<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:10', 'max:20'],
            'spend' => ['required', 'numeric', 'min:0'],
            'revenue' => ['required', 'numeric', 'min:0'],
            'conversions' => ['required', 'integer', 'min:0'],
            'platform_id' => ['required', 'integer', 'exists:platforms,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
